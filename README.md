[![QUT Centre for Robotics Open Source](https://github.com/qcr/qcr.github.io/raw/master/misc/badge.svg)](https://qcr.github.io)

# QCR Open Source Website

This repository holds the QCR open source website; a central place where the [QUT Centre for Robotics](https://research.qut.edu.au/qcr/) lists all of its code and datasets available to the community.

The site is designed to make it easy for any member of the QCR (and affiliated members) to share their projects with the community under the QCR banner. In turn, we hope that the community can grow to identify this as a go-to place to look for novel state-of-the-art open source robotics software and datasets.

We have created the website to be _content-driven_: you provide some content describing your cool stuff, and we produce a website to show it off for you.

_Content_ is simply a Markdown file with some [front-matter](https://github.com/jxson/front-matter) containing settings for how you want your content displayed. See [below](#content-settings-specification) for a full outline of supported content settings.

## Quickstart

Here's some common things you may wish to do, and how to do them within the website:

### Quickly add a GitHub repository / dataset / project to the website

For example, the following would make a repository [https://github.com/btalb/abstract_map](https://github.com/btalb/abstract_map) available at [https://qcr.github.io/code/my-repo](https://qcr.github.io/code/my-repo):

1. Create a new file called `my-repo.yaml` in the `./content/` directory. Add the following contents to the file:
   ```markdown
   ---
   name: The Abstract Map
   type: code
   url: https://github.com/btalb/abstract_map
   ---
   ```
2. Commit the changes, & push them to the `master` branch
3. Wait until all [pending actions](https://github.com/qcr/qcr.github.io/actions) are complete (these are rebuilding the site with the new content)

That's it. The repository should now be on the site, with the first image used as the feature image in cards and the content of its `README.md` file displayed on the [https://qcr.github.io/code/my-repo](https://qcr.github.io/code/my-repo) page. See the [content settings specification](#content-settings-specification) for details on how to add other types of content for the site, or look at some of the many live examples in the `./content/` directory of this repository.

### Adding content to the site the proper way

The previous method is not a great way to develop. You add content, blindly create commits on `master`, and hope for the best while it builds. Then painfully rinse and repeat until you get it as you want it.

Instead, it's much better to add content locally & push it up to the main site when you're happy with your additions. To do this, you first need to make sure you have the latest LTS of NodeJs installed, ffmpeg, & Git:

```
sudo apt install nodejs npm ffmpeg git
sudo npm --global install n
sudo n lts
```

Then clone this repo, & install the NodeJs dependencies of our website:

```
git clone https://github.com/qcr/qcr.github.io && cd qcr.github.io
npm install
```

You're now good to go. Start the development server by running the following in a terminal:

```
npm run dev
```

Go to [http://localhost:3000](http://localhost:3000) in your browser, and you should see the website running locally on your machine. From here you can add content to the site like you did above but view the changes locally before pushing them up to the live site's build & hosting processes.

_(when you make changes some may appear immediately, some may require a manual page refresh, and the rare cases may require restarting the development server)_

Want to be really sure your changes will successfully build? You can build the entire site locally by running:

```
npm run build
```

### Showing your QCR affiliation on your repository

[Shield Badges](https://github.com/badges/shields) at the top of your `README.md` are a great way to do this (see the top of this `README.md` for a demo). To add a QCR badge to your repository that links to this site, add the following below your title in your `README.md`:

```markdown
[![QUT Centre for Robotics Open Source](https://github.com/qcr/qcr.github.io/raw/master/misc/badge.svg)](https://qcr.github.io)
```

Alternatively, if you want to have a set of badges that are centred you can use raw HTML tags:

```markdown
<p align="center">
  <a href="https://qcr.github.io" alt="QUT Centre for Robotics Open Source"><img src="https://github.com/qcr/qcr.github.io/raw/master/misc/badge.svg" /></a>
</p>
```

_(as a reference, the current badge was generated [here](https://shields.io/) with #00407a used as the colour)_

### Update the site automatically when README / Markdown files change in your repository

**_NOTE: not currently implemented... waiting on a 'qcrbot' QUT managed account_**

**_Note: this will only work if you are a member of the [QCR GitHub organisation](https://github.com/qcr)_**

When `code` content on this site is displaying a Markdown file from your code repository it can be annoying to remember to manually update this site every time that Markdown file changes in your code repository. Instead, what you can do is add a [GitHub Action](https://github.com/features/actions) to your repository to remotely request rebuilding of this site when you push to `master`. To do this:

1. Copy the contents of the action file: [https://github.com/qcr/tools/raw/develop/github_actions/trigger_site_update.yaml](https://github.com/qcr/tools/raw/develop/github_actions/trigger_site_update.yaml)
2. Paste them into a YAML file in the `.github/workflows/` directory of your code repository
3. Edit the YAML payload at the start of the action file to match your desired settings (syntax is the same as if you were manually adding a `code` content entry here)
4. Push the changes to `master`

Done. Now whenever you edit the corresponding Markdown content a site rebuild will be triggered here.

_(a separate content entry is created from this process; you need to ensure you delete any manually added `code` content entries here or you will probably get duplicate content errors)_

## Content Settings Specification

Settings for your content are provided in a 'fenced' [front-matter](https://github.com/jxson/front-matter) block at the start of a Markdown file. The syntax inside the fenced block is YAML. For example:

```markdown
---
name: My awesome research project
type: project
id: awesome-research
image_position: 50% 100%
---

# Heading

The rest of my markdown...
```

As the above example shows, settings are a set of named keys with a corresponding values. The full list of supported keys, when they're required, and their description are as follows:

| Key              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`           | (required)<br>The name given to your content which will appear in cards & on the page title                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `type`           | (required)<br>The type of your content (must be one of `code`, `dataset`, or `project`)                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `url`            | (required unless `type == 'project'`)<br>A URL associated with your content (i.e. the URL for the code's GitHub repository, the download link for a dataset, or an external website for your project)                                                                                                                                                                                                                                                                                                                              |
| `id`             | (optional)<br>The ID for this piece of content that is used throughout the site, including in the URL (i.e. a `project` with `id` `'awesome-research'` will be available at `https://qcr.github.io/project/awesome-research`). Is pulled from the filename of this file without the extension if not provided. An error is thrown if there are duplicate ID & type pairs (e.g. there can be both a `project` and `code` with `id` `'benchbot'`, but not two `projects` with the `'benchbot'` `id`).                                |
| `content`        | (optional)<br>Render this Markdown file for your content _instead_ of what follows in the current file. This is particularly useful for `code` content that wants to use a file like `repo.md` from its GitHub repository. To do this, set `content` to `repo:/repo.md`<sup>**1**</sup>. Rendered content is the first hit in this list:<ol><li>Value provided for this key<li>Markdown following front-matter in this file<li>`repo:/README.md` if type is `code`<li>Error is raised as we couldn't find any usable content!</ol> |
| `image`          | (optional)<br>Image to use as the feature image on the content's card throughout the site. The chosen feature image is the first hit in this list:<ol><li>Value provided for this key<li>First _non-svg_ image in the Markdown content with a _local_ `src` (i.e. not `https://...`)<li>The [default fallback image](https://github.com/qcr/qcr.github.io/raw/master/assets/qcr_logo_light_filled.png)                                                                                                                             |
| `image_position` | (optional)<br>Uses the CSS [background-position](https://www.w3schools.com/cssref/pr_background-position.asp) property to specify feature image position in the card. For example, `center 100%` focuses on the bottom half of an image, `center 0%` on the top half, `0% center` on the left half, and `center` or `center center` on the centre of the image. The default value is `center`.                                                                                                                                     |
| `code`           | (optional, only valid when `type == 'project'`)<br>A list of IDs denoting the `code` content that is a part of this project.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `datasets`       | (optional, only valid when `type == 'project'`)<br>A list of IDs denoting the `dataset` content that is a part of this project.                                                                                                                                                                                                                                                                                                                                                                                                    |

<sup>**1**</sup> We enable a special URI across this website for specifying files from another _GitHub_ repository. The full URI syntax is `repo:<repo_username>/<repo_name>/<path_to_file>`. For example, the URI `repo:btalb/abstract_map/docs/project_outline.png` requests the `docs/project_outline.png` file from the `https://github.com/btalb/abstract_map` repository. In cases where we can infer repository URL from surrounding context (like in all of the setting keys described above), a minimal URI can be used: `repo:/<path_to_file>`. In the previous example, `repo:/docs/project_outline.png` could be used assuming the `url` key was set to `https://github.com/btalb/abstract_map`.

## Technical Details

**TODO depending on usefulness / value...**
