# RISK WISE

## Overview

The “Enhancing Risk Assessments (ERA) for improved country risk financing strategies” project aims to provide government partners in Egypt and Thailand with a new generation of climate risk assessments for developing their climate change adaptation measures and, subsequently, their climate and disaster risk financing strategies. To this end, the ERA project will apply the Economics of Climate Change Adaptation (ECA) approach and will enhance the underlying risk assessment tool CLIMADA with the following new features:

1. Analyzing impacts of hazards on macroeconomic indicators (e.g., GDP, employment).
2. Analyzing the impact of hazards on non-economic impacts (e.g., access to health and education).
   Additionally, the project aims to enable the dynamic application of CLIMADA by partner institutions through an easy-to-use and accessible graphical user interface (GUI).

RISK WISE is a Graphical User Interface (GUI) for [CLIMADA](https://wcr.ethz.ch/research/climada.html). RISK WISE encompass CLIMADA’s full functionality, including the cost-benefit analyses of adaptation measures and new features developed within the ERA project, in order to enable local project partners to use CLIMADA independently.

## Dependencies and limitations

1. Physical limitations
   RISK WISE is a standalone, portable desktop application designed for ease of use. It is delivered as a self-contained folder containing all the necessary files, including an executable for starting the application. Double-clicking on this executable file will launch the application. No installation or special prerequisites are required. However, to ensure optimal performance, the following minimum system requirements are recommended:
   CPU: 1GHz dual core. Although RISK WISE is not heavily CPU-intensive, tasks like impact calculations, map rendering, and report generation may increase CPU usage.

- RAM: 8GB. This is crucial as the application uses Python’s Pandas library for data handling, performing in-memory analytics. When processing large datasets, such as a 10GB dataset, the application requires at least an equivalent amount of free memory. This is because Python performs many calculations in memory, which can significantly increase the overall memory requirement.
- Operating System: Microsoft Windows 10.
- Internet Connection: Essential for accessing data through CLIMADA’s API.

  These requirements are typical for a general-use laptop/PC.

2. CLIMADA API dependency
   RISK WISE frequently communicates with CLIMADA's API to fetch and validate datasets, among other tasks. API availability is crucial if the API is not accessible, significant functionality issues will arise. RISK WISE uses .hdf5 files for Exposure and Hazard data, obtainable from sources [ETH-Zurich Research Collection](https://www.research-collection.ethz.ch/) and [NASA’s Socioeconomic Data and Applications Center (sedac)](https://sedac.ciesin.columbia.edu/data/collection/gpw-v4/sets/browse). The application's Python backend fetches these files. In their absence, users can provide the necessary parameters, and the application will find, download, and store the datasets.

## Setup and Running the Application

### For Developers

1. **Clone the Repository**:
   ```sh
   git clone git@ath-git.swordgroup.lan:unu/climada-unu.git
   cd CLIMADA-UNU
   git checkout main
   ```
2. **Set Up a Virtual Environment** (optional but recommended):
   _Setting up a local environment is only required to test different parts of the application, for example using Jupyter notebooks to run custom climate scenarios. The application itself does not require a local environment to work, it comes bundled with the frozen climada_env conda environment which includes everything needed for the application to work._

   ```sh
   # Using venv
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

   # Or using Conda
   conda create --name riskwise python=3.11
   conda activate riskwise

   # Or using the prebuilt Conda environment
   conda env create -f requirements/environment.yml
   ```

3. **Install Dependencies for the backend**:

   ```sh
   pip install -r requirements/requirements.txt
   ```

4. **Install Dependencies for the frontend**:
   Before running the app locally, make sure Node.js is installed. Download and install Node.js from [the official Node.js website](https://nodejs.org/). After installing Node.js, navigate to the root directory of the app where the `package.json` file exists using your terminal or command prompt. Then, run the following command to install the dependencies:

   ```sh
   npm install
   ```

5. **Start the ReactJS frontend locally**:
   To start the ReactJS frontend locally, without the connection to the backend, use:

   ```sh
   npm start
   ```

6. **Start the RISK WISE application locally**:
   The application is bundled using [electron-builder](https://www.electron.build/). To start the full application locally, navigate to the root directory of the app and using your terminal or command prompt, run the following command:
   ```sh
   npm run start:electron
   ```

### Build a new executable

To create a new executable for the application, navigate to the root directory of the app and using your terminal or command prompt, run the following command:

```sh
npm run build
```

This will create a new executable at dist/[ version ]

## Logging

The application logs important actions and errors, facilitating debugging and monitoring. The logs are stored locally in the logs/app.log file.

## Documentation

Ensure you generate the updated documentation when pushing relevant code. Navigate to the root directory of the app and using your terminal or command prompt, run the following command:

```sh
sphinx-build -b html docs/ docs/_build
```

Developer documentation, including a detailed description of API endpoints and usage examples, can be found [here](https://ath-git.swordgroup.lan/unu/climada-unu/).

### Install LaTeX (for PDF Generation)

To generate PDFs, you'll need a LaTeX distribution. Follow these instructions based on your operating system:

1. **Windows**: Install [MiKTeX](https://miktex.org/download). During installation, ensure you select the option to install packages on-the-fly, so MiKTeX can automatically download any missing packages.

2. **macOS**: Install [MacTeX](https://tug.org/mactex/). After installation, make sure `pdflatex` is in your PATH by opening a terminal and running:
   ```sh
   which pdflatex
   ```

To generate a PDF version of the documentation, follow these steps:

1. **Build LaTeX Files**: Run the following command to create LaTeX files in the `docs/_build/latex` directory.

   ```sh
   sphinx-build -b latex docs/ docs/_build/latex

   ```

2. **Navigate to LaTeX Directory**:

   ```sh
   cd docs/_build/latex

   ```

3. **Generate PDF with pdflatex**:
   Run the command below, which compiles the tex file to PDF format. If needed, run this command multiple times to ensure cross-references resolve properly.

   ```sh
   pdflatex riskwise.tex
   ```

## Before Opening a Pull Request

Ensure you run the tests and comply with the linting standards before opening a pull request:

- Run tests:

```sh
# Navigate to the backend directory
cd ./backend
# Execute tests
python -m unittest tests/test_api.py

# Navigate to the frontend directory
cd ./src
# Execute tests
npx eslint .
```

- Check linting:

```sh
# Navigate to the backend directory
cd ./backend
# Run pylint
pylint --exit-zero --fail-under=9 .
```

Failure to meet the test coverage and linting standards will result in CI pipeline failures.

## Tag new version

Upon merging a feature branch to the main branch, make sure you tag the new version of the application accordingly.

```sh
git tag -a <version> -m "<tag_title>" -m "tag_comments"

# Example
git tag -a v0.5.5 -m "RISK WISE version 0.5.5" -m "
>>
>> - Refactor run scenario process to increase performance and readability.
>> - Modify information shown on Hazard and Risk maps.
>> - Modify the run era scenario process with proper entity files.
>> - Fix minor issues when extracting information out of hazard .mat and .tif files.
>> "
```

# Working with Forks and Pull Requests

If you're contributing to RISK WISE, it’s recommended to fork the repository and follow the steps below to make changes, ensure your contributions are tested, and submit them for review by the maintainers. This process helps keep the original repository clean and organized.

---

## 1. Fork the Repository

1. Go to the GitHub repository for RISK WISE.
2. Click the **Fork** button in the top-right corner of the repository page.
3. This will create a copy of the repository under your GitHub account.

---

## 2. Clone Your Fork Locally

1. Copy the URL of your forked repository (e.g., `https://github.com/username/climada-unu.git`).
2. Clone it to your local machine:
   ```bash
   git clone <your-fork-url>
   cd climada-unu
   ```

3. Add the original repository as the `upstream` remote:
   ```bash
   git remote add upstream git@github.com:original-organization/climada-unu.git
   ```

4. Verify your remotes:
   ```bash
   git remote -v
   ```
   You should see:
   ```
   origin    https://github.com/username/climada-unu.git (fetch)
   origin    https://github.com/username/climada-unu.git (push)
   upstream  https://github.com/original-organization/climada-unu.git (fetch)
   upstream  https://github.com/original-organization/climada-unu.git (push)
   ```

---

## 3. Keep Your Fork Updated

Before starting any work, ensure your fork is up-to-date with the original repository:
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## 4. Create a New Branch

1. Always create a new branch for your changes:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Work on your changes in this branch.

---

## 5. Make Changes and Commit

1. Make your changes, and test them locally.
2. Add your changes to the staging area:
   ```bash
   git add .
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature X to improve functionality"
   ```

---

## 6. Push Changes to Your Fork

1. Push your branch to your forked repository:
   ```bash
   git push origin feature/my-new-feature
   ```

---

## 7. Open a Pull Request

1. Go to your forked repository on GitHub.
2. Click the **Compare & pull request** button.
3. Select the branch you want to merge into in the original repository (e.g., `main`).
4. Provide a descriptive title and detailed description of your changes.
5. Submit the pull request.

---

## 8. Respond to Review Feedback

1. If maintainers request changes:
   - Make updates locally in the same branch.
   - Commit and push the changes:
     ```bash
     git add .
     git commit -m "Address review comments"
     git push origin feature/my-new-feature
     ```
   - The pull request will automatically update.

---

## 9. Delete Your Branch After Merging

Once your pull request is merged:
1. Delete your local branch:
   ```bash
   git branch -d feature/my-new-feature
   ```
2. Delete the branch from your forked repository:
   ```bash
   git push origin --delete feature/my-new-feature
   ```

---

## Example Workflow

### Scenario: Adding a New Feature to Enhance the Hazard Map Functionality

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/username/climada-unu.git
   cd climada-unu
   git remote add upstream https://github.com/original-organization/climada-unu.git
   ```

2. Ensure your fork is up-to-date:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

3. Create a new branch:
   ```bash
   git checkout -b feature/enhance-hazard-map
   ```

4. Make your changes, test them, and commit:
   ```bash
   # After making changes...
   git add .
   git commit -m "Enhance hazard map by adding XYZ functionality"
   ```

5. Push your branch to your fork:
   ```bash
   git push origin feature/enhance-hazard-map
   ```

6. Open a pull request on GitHub, targeting the `main` branch of the original repository.

7. Respond to any review comments, make changes, and push updates:
   ```bash
   git add .
   git commit -m "Fix issue as per review comments"
   git push origin feature/enhance-hazard-map
   ```

8. After the PR is merged, delete your branch locally and on your fork:
   ```bash
   git branch -d feature/enhance-hazard-map
   git push origin --delete feature/enhance-hazard-map
   ```

---

This structured workflow ensures contributors work efficiently without cluttering the main repository while providing maintainers with a clear and organized review process.

## CLIMADA Citation

Publications:

- **General Use**: Cite the [Zenodo archive](https://doi.org/10.5281/zenodo.3406473) of the specific CLIMADA version you are using.

- **Impact Calculations**: Aznar-Siguan, G. and Bresch, D. N. (2019): CLIMADA v1: A global weather and climate risk assessment platform, Geosci. Model Dev., 12, 3085–3097, [https://doi.org/10.5194/gmd-12-3085-2019](https://doi.org/10.5194/gmd-12-3085-2019).

- **Cost-Benefit Analysis**: Bresch, D. N. and Aznar-Siguan, G. (2021): CLIMADA v1.4.1: Towards a globally consistent adaptation options appraisal tool, Geosci. Model Dev., 14, 351–363, [https://doi.org/10.5194/gmd-14-351-2021](https://doi.org/10.5194/gmd-14-351-2021).

- **Uncertainty and Sensitivity Analysis**: Kropf, C. M. et al. (2022): Uncertainty and sensitivity analysis for probabilistic weather and climate-risk modelling: an implementation in CLIMADA v.3.1.0. Geosci. Model Dev. 15, 7177–7201, [https://doi.org/10.5194/gmd-15-7177-2022](https://doi.org/10.5194/gmd-15-7177-2022).

- **Lines and Polygons Exposures**: Mühlhofer, E., et al. (2024): OpenStreetMap for Multi-Faceted Climate Risk Assessments: Environ. Res. Commun. 6 015005, [https://doi.org/10.1088/2515-7620/ad15ab](https://doi.org/10.1088/2515-7620/ad15ab).

- **LitPop Exposures**: Eberenz, S., et al. (2020): Asset exposure data for global physical risk assessment. Earth System Science Data 12, 817–833, [https://doi.org/10.3929/ethz-b-000409595](https://doi.org/10.3929/ethz-b-000409595).

- **Impact Function Calibration**: Riedel, L., et al. (2024): A Module for Calibrating Impact Functions in the Climate Risk Modeling Platform CLIMADA. Journal of Open Source Software, 9(99), 6755, [https://doi.org/10.21105/joss.06755](https://doi.org/10.21105/joss.06755).

- **GloFAS River Flood Module**: Riedel, L. et al. (2024): Fluvial flood inundation and socio-economic impact model based on open data, Geosci. Model Dev., 17, 5291–5308, [https://doi.org/10.5194/gmd-17-5291-2024](https://doi.org/10.5194/gmd-17-5291-2024).

For a comprehensive list of CLIMADA-related publications, refer to the [Zotero library](https://www.zotero.org/groups/2523345/climada_publications). You can also download the complete BibTeX file: [climada_publications.bib](https://www.zotero.org/groups/2523345/climada_publications/items/collectionKey/9K5I3X3I/items/top?format=bibtex&limit=1000). 

More information on [CLIMADA](https://wcr.ethz.ch/research/climada.html)