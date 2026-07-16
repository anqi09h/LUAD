# KRT16 in LUAD

A simple static portfolio website documenting an in-progress analysis of KRT16
expression and clinical relevance in TCGA-LUAD lung adenocarcinoma data.

The project uses R and TCGAbiolinks to prepare:

- a KRT16 tumour-versus-normal expression plot;
- a paired expression sensitivity analysis when matched samples are available;
- a Kaplan-Meier overall-survival curve and Cox model; and
- a clinical-association plot or adjusted Cox forest plot.

The website is written with plain HTML, CSS, and JavaScript, so it does not
require npm, a build step, or a web framework.

## Open the website locally

The quickest option is to open `index.html` directly in a web browser.

For a more realistic local website, open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Add analysis plots

Create a folder named `plots` beside `index.html`, then add:

```text
plots/
├── krt16_expression.png
├── krt16_paired.png
├── krt16_survival.png
└── krt16_clinical.png
```

The website shows designed placeholder graphics when these files are missing.
They will be replaced automatically when the PNG files are added.

## Customize the website

Before publishing:

1. Replace the `#` in the "View on GitHub" link near the bottom of `index.html`
   with the URL of your repository.
2. Update any project wording as the analysis develops.
3. Add your exported plots to the `plots` folder.

## Host with GitHub Pages

1. Create a GitHub repository and upload all website files.
2. On the repository page, open **Settings**.
3. Select **Pages** in the sidebar.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and the `/ (root)` folder, then click **Save**.
6. GitHub will provide the published website URL after deployment finishes.

Because this is a static website, no additional configuration or build command
is needed.

## Project status

This analysis is still in progress. KRT16 is a research target, not a validated
biomarker, and the scientific interpretation may change as the workflow is
checked and expanded.
