---
name: 'RT-BENE: Real-Time Blink Estimation in Natural Environments Dataset'
type: dataset
url: https://zenodo.org/record/3685316
url_type: external
size: 600MB
id: rt_bene_dataset
image: repo:Tobias-Fischer/rt_gene/assets/rt_bene_labels.png
image_fit: contain
---

The RT-BENE dataset is a new open-sourced dataset with annotations of the eye-openness of more than 200,000 eye images, including more than 10,000 images where the eyes are closed. We annotate the RT-GENE dataset, which was proposed for gaze estimation, with blink labels. We define open eyes as images where at least some part of the sclera (white part of the eye) or pupil is visible. Closed eyes are those where the eyelids are fully closed. The uncertain category is used when the image cannot be clearly grouped into one of the other categories due to e.g. extreme head poses, or when the two annotators labelled the image differently. Using this approach, we labelled in total 243,714 images, 218,548 of them where the eyes are open, 10,444 where the eyes are closed and 14,722 uncertain images.

![RT-BENE dataset](https://github.com/Tobias-Fischer/rt_gene/blob/master/assets/rt_bene_overview.png)

The work done in this project was done within the [Personal Robotics Lab at Imperial College London](https://www.imperial.ac.uk/personal-robotics).
