# QCR Open Source Website

This repository holds the QCR open source website; a central place where the [QUT Centre for Robotics](https://research.qut.edu.au/qcr/) lists all of its code and datasets available to the community.

The site is designed to make it easy for any member of the QCR (and affiliated members) to share their projects with the community under the QCR banner. In turn, we hope that the community can grow to identify this as the go-to place to look for novel state-of-the-art open source robotics software and datasets.

## How the website works

The website is designed to be _data-driven_. That means all you need to do is given the website the data you want it to display (projects, repos, datasets, markdown content, images), and it takes care of transforming that into something engaging for users. We chose this approach to match the needs of our content providers (QCR members); you want to share your exciting open source research with the community, not waste time fiddling around with CSS, HTML, etc.

The `./data/` directory of the repository is where you should start if you want to add to the site. Here there are a list of projects, repositories, and datasets described by `*.yaml` files. If you want to add something you've created to the site, simply add the data to the appropriate `*.yaml` file.

TODO adding content.

## Getting started

Adding to the website simply requires making the changes in Markdown or YAML, then committing & pushing them. The website is rebuilt in the background with your changes using a GitHub Action. The best workflow to make & apply changes depends on the scope of your changes.

### "I just need to make a quick change to some content in a markdown file"

You can do this simply by editing the file directly in the GitHub site (note: this is only recommended if you're making changes in a single file).

### "I need to make a couple of minor edits to the site content"

For example, you may need to update an image & change the markdown text describing the image. The edits make no sense in isolation, but only make sense _in combination_. For this reason you shouldn't do the previous method (GitHub will make a commit for every file you edit), instead it's best to work on a local copy of the repository & bundle it up in a single commit.

First get a local copy of the website on the master branch:

```
git clone -b master https://github.com/qcr/qcr.github.io
```

Then make all of your desired changes, & send them back to the remote:

```
git add .
git commit
git push
```

### "I need to add projects, repositories, etc. & want to see the effects before making them live"

This is the best approach, & will result in less live updates to the website that then need to be instantly fixed. It requires you running a _local development server_ to play with the website on your computer, and the same steps as above once you're happy.

You need a recent version of NodeJs installed like the latest LTS, which is easily installable using `n` (interactive NodeJs version manager):

```
sudo apt install nodejs npm
sudo npm --global install n
sudo n lts
```

Then install the NodeJs dependencies of our website by running the following in the directory where you've clone the repo:

```
npm install
```

You're good to go. Start the dev server using the following, and open [http://localhost:3000] in your browser:

```
npm run dev
```
