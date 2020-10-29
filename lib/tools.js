const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

const REMOTE_DIR = path.join(__dirname, '../content/.remote');

function createRemoteEntry(inputsString) {
  console.log(typeof inputsString);
  console.log(inputsString);
  // Ensure inputs meet the minimum requirements
  const inputs = JSON.parse(inputsString);
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
  fs.mkdirSync(path.join(REMOTE_DIR, repo_user), {recursive: true});
  fs.writeFileSync(
    path.join(REMOTE_DIR, repo_user, `${repo_name}.md`),
    inputsToMarkdown(inputs)
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

module.exports = {createRemoteEntry};
