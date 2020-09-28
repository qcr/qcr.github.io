[![QUT Centre for Robotics Open Source](https://github.com/qcr/qcr.github.io/blob/master/misc/badge.svg)](https://qcr.github.io)

# QCR Open Source Website

This repository holds the QCR open source website; a central place where the [QUT Centre for Robotics](https://research.qut.edu.au/qcr/) lists all of its code and datasets available to the community.

The site is designed to make it easy for any member of the QCR (and affiliated members) to share their projects with the community under the QCR banner. In turn, we hope that the community can grow to identify this as the go-to place to look for novel state-of-the-art open source robotics software and datasets.

We have created the website to be _content-driven_: you provide some content describing your cool stuff, and we produce a website to show it off for you. _Content_ is simply a Markdown file with some [front-matter](https://github.com/jxson/front-matter) containing settings for how you want your content displayed. See [below](#content-settings-specification) for a full outline of supported content settings.

## Quickstart

Here's some common things you may wish to do, and how to do them with our website:

### Adding your GitHub repository to the website

TODO

### Showing your QCR affiliation on your repository

[Shield Badges](https://github.com/badges/shields) at the top of your `README.md` are a great way to do this (see the top of this `README.md` for a demo). To add a QCR badge to your repository that links to this site, add the following below your title in your `README.md`:

```markdown
[![QUT Centre for Robotics Open Source](https://github.com/qcr/qcr.github.io/blob/master/misc/badge.svg)](https://qcr.github.io)
```

Alternatively, if you want to have a set of badges that are centred you can use raw HTML tags:

```markdown
<p align="center">
  <a href="https://qcr.github.io" alt="QUT Centre for Robotics Open Source"><img src="https://github.com/qcr/qcr.github.io/blob/master/misc/badge.svg" /></a>
</p>
```

_(as a reference, the current badge was generated [here](https://shields.io/) with #00407a used as the colour)_

## Content Settings Specification

Settings for your content is displayed are provided in a 'fenced' [front-matter](https://github.com/jxson/front-matter) block at the start of a Markdown file. The syntax inside the fenced block is YAML. For example:

```markdown
---
name: My awesome research project
type: project
id: awesome-research
image_position: 50% 100%
---

... rest of file ...
```

As the above example shows, settings are a set of named keys with a corresponding values. The full list of supported keys, when they're required, and their description are as follows:

| Key    | Description                                                                                                                                                                                           |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | (required)<br>The name given to your content which appears in cards & on the page title                                                                                                               |
| `type` | (required)<br>The type of your content (must be one of `code`, `dataset`, or `project`)                                                                                                               |
| `url`  | (required unless `type == 'project'`)<br>A URL associated with your content (i.e. the URL for the code's GitHub repository, the download link for a dataset, or an external website for your project) |

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
