# Decoding LUAD

A simple static portfolio website documenting an in-progress bioinformatics
analysis of TCGA-LUAD lung adenocarcinoma data.

The project uses R, TCGAbiolinks, and maftools to:

- access and prepare TCGA-LUAD mutation data;
- read Mutation Annotation Format (MAF) files;
- create mutation summary, oncoplot, and transition/transversion plots; and
- prepare tumour and normal RNA-seq data for future analysis.

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
├── oncoplot.png
├── maf_summary.png
└── titv.png
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

This analysis is still in progress. The current plots are descriptive, the RNA
expression matrix is being prepared, and the scientific interpretation may
change as the workflow is checked and expanded.
