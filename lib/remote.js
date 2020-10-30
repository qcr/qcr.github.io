const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

const REMOTE_DIR = '/content/.remote';
const REMOTE_DIR_REL = path.join(__dirname, '..', REMOTE_DIR);

function createRemoteEntry(inputs) {
  // Ensure inputs meet the minimum requirements
  if (!inputs.name) {
    console.log("Payload is missing the required 'name' field. Aborting.");
    return false;
  }
  if (!inputs.url) {
    console.log("Payload is missing the required 'url' field. Aborting.");
    return false;
  }

  // Pull out user & repo name info from URL
  const {user: repo_user, name: repo_name} = inputs.url.match(
    /(?<user>[^/]*)\/(?<name>[^/]*)$/
  ).groups;

  // Dump the input data to the corresponding file
  init(repo_user);
  fs.writeFileSync(
    path.join(REMOTE_DIR_REL, repo_user, `${repo_name}.md`),
    inputsToMarkdown(inputs)
  );
}

function init(repo_user) {
  fs.mkdirSync(
    repo_user ? path.join(REMOTE_DIR_REL, repo_user) : REMOTE_DIR_REL,
    {recursive: true}
  );
}

function inputsToMarkdown(inputs) {
  // Perform input validation / modification
  inputs.type = 'code';
  if (inputs.content)
    inputs.content = inputs.content.replace(/^(.\/)?(\/)?/, 'repo:/');
  if (inputs.image)
    inputs.image = inputs.image.replace(/^(.\/)?(\/)?/, 'repo:/');

  // Return string with input dumped as YAML front-matter
  return matter.stringify('', inputs);
}

module.exports = {REMOTE_DIR, createRemoteEntry};
