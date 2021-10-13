---
name: BenchBot Environments for Active Robotics (BEAR)
type: dataset
url: https://cloudstor.aarnet.edu.au/plus/s/pr8Bthtj2OFbg4R/download
size: 15.9GB
---

The BenchBot Environments for Active Robotics (BEAR) are a set of Unreal Engine environments for use with the [BenchBot software stack](http://benchbot.org) in the [ACRV Semantic Scene Understanding Challenge](https://evalai.cloudcv.org/web/challenges/challenge-page/625/overview). A collage of the robot starting position for each of the environments is shown below:

![Robot starting positions for all BenchBot environments for active robotics (BEAR)](./all_envs.png)

Features of the dataset include:

- a total of 25 different environments
- 5 different places:
  - house: A Scandanavian house - approx. 164 m<sup>2</sup>
  - miniroom: A small apartment room - approx. 19 m<sup>2</sup>
  - apartment: A luxurious penthouse apartment - approx. 110 m<sup>2</sup>
  - company: A large corporate building - approx. 480 m<sup>2</sup>
  - office: An office workspace - approx. 201 m<sup>2</sup>
- each place has 5 different variations
- between variations there are changes in lighting, time of day, starting location, robot trajectory, and object placements

The primary and easiest way to utilise the dataset is through [BenchBot software stack](http://benchbot.org). For full instructions on using an active agent within the environments with BenchBot we refer users to the BenchBot documentation. The link above gives access to the packaged Unreal "games" (not raw assets) for all environments, split into a development and challenge set, in line with the original scene understanding challenge. Develop contains house and miniroom. Challenge contains apartment, company, and office. Note that these ae just the environments. Ground truth object cuboid maps are located in the BenchBot add-ons [ground_truths_isaac_develop](https://github.com/benchbot-addons/ground_truths_isaac_develop) and [ground_truths_isaac_challenge](https://github.com/benchbot-addons/ground_truths_isaac_challenge) respectively.

For more details of the dataset, challenge, BenchBot, and how it all fits together, please see our summary video below:

@[youtube](https://www.youtube.com/watch?v=jQPkV29KFvI)
