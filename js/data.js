/* ==========================================================================
   data.js - Static content for the Data Science Laboratory website
   --------------------------------------------------------------------------
   MODULES      : the five study modules (placeholder titles, real PDF viewer)
   EXPERIMENTS  : the real lab experiments found in the DS-codes folder
   All rendering code reads from these arrays. Add an item here and it shows
   up everywhere automatically (home page, listing pages, counters).
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   *  MODULES
   *  Official Curriculum for Data Science (Subject Code 22DS102006)
   * ------------------------------------------------------------------ */
  const MODULES = [
    {
      id: "m1",
      number: 1,
      title: "Introduction to Data Science",
      code: "22DS102006 · Module 1",
      description:
        "Definition of Data Science, 3Vs of Data, Applications across Domains, Essential Skills & Job Roles, Tools (Python, R, SQL, UNIX), Structured vs Unstructured Data, Data Preprocessing, and 6 Analytical Categories.",
      pdf: "assets/pdfs/module-1.pdf"
    },
    {
      id: "m2",
      number: 2,
      title: "Data Extraction & Feature Selection",
      code: "22DS102006 · Module 2",
      description:
        "Extracting meaning from data (Kaggle vs Google), Feature Selection (Filter, Wrapper, Embedded, Hybrid), Stepwise Regression, Entropy, Decision Trees, Random Forests, SVD, and PCA.",
      pdf: "assets/pdfs/module-2.pdf"
    },
    {
      id: "m3",
      number: 3,
      title: "Plotting and Visualization",
      code: "22DS102006 · Module 3",
      description:
        "Matplotlib API primer, figures & subplots, formatting lines and markers, ticks, labels, legends, annotations, patches, pandas plotting, Seaborn statistical charts, scatter plots, and facet grids.",
      pdf: "assets/pdfs/module-3.pdf"
    },
    {
      id: "m4",
      number: 4,
      title: "Statistical Thinking & Distributions",
      code: "22DS102006 · Module 4",
      description:
        "Histograms, outlier detection, central tendency & dispersion, PMFs vs CDFs, Class Size Paradox, pandas DataFrame indexing, random numbers & bootstrapping, and modeling continuous distributions (Normal, Exponential, Lognormal).",
      pdf: "assets/pdfs/module-4.pdf"
    },
    {
      id: "m5",
      number: 5,
      title: "Time Series Analysis & Predictive Modeling",
      code: "22DS102006 · Module 5",
      description:
        "Time series properties, components (trend, seasonality, cyclicality), forecasting models (AR, ARIMA, SARIMA, VAR, Holt-Winters, DLMs, LSTMs, HMMs), moving averages (SMA, EMA), missing data imputation, and predictive model evaluation metrics (Confusion Matrix, ROC-AUC, RMSE).",
      pdf: "assets/pdfs/module-5.pdf"
    }
  ];

  /* ------------------------------------------------------------------ *
   *  EXPERIMENTS
   *  Every sub-experiment maps 1:1 to a source file written for the lab
   *  (extracted / copied from the original DS-codes files). Nothing here
   *  overwrites the student's own code.
   * ------------------------------------------------------------------ */

  const EXPERIMENTS = [
    /* ================= EXPERIMENT 1 ================= */
    {
      id: 1,
      number: "1",
      title: "Data Acquisition & File I/O with pandas",
      short:
        "Load datasets from web URLs, local CSV/TXT files, JSON payloads and Excel workbooks.",
      description:
        "This experiment demonstrates how a data scientist acquires data from many sources. You will read remote CSV data over HTTP, read and write local delimited files, serialise data to and from JSON, and work with Excel workbooks that contain multiple sheets.",
      objective:
        "To learn how to import datasets into pandas from different storage formats and how to export processed data back to disk.",
      concepts: ["pandas", "read_csv / to_csv", "read_json", "read_excel", "ExcelWriter", "DataFrames"],
      outcome:
        "After this experiment you should be able to load any common tabular file format, inspect it and persist results back to disk.",
      image: "assets/images/hero-illustration.svg",
      subExperiments: [
        {
          id: "1a",
          label: "1A",
          title: "Reading a CSV dataset from a web URL",
          summary: "Use pandas.read_csv() to load the Iris dataset directly from a public URL.",
          problem: "Datasets are often published online. Load one directly into a DataFrame without downloading it manually.",
          aim: "To read a CSV file hosted on the web and inspect its structure using pandas.",
          algorithm: [
            "Import the pandas library.",
            "Store the raw URL of the CSV file in a variable.",
            "Call pandas.read_csv(url) to build a DataFrame.",
            "Display the first five rows with df.head().",
            "Inspect the schema with df.info() and the size with df.shape."
          ],
          inputFormat: "A URL that points to a valid CSV file.",
          expectedOutput: "The first five rows of the dataset, a schema summary and the (rows, columns) shape.",
          sampleInput: 'url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"',
          sampleOutput: "(150, 5)  -  150 rows and 5 columns",
          source: "DS-codes/experiment-1/1a.py",
          language: "python",
          video: "assets/videos/exp-1a.webm",
          recordedOutput:
            "First Five rows in data\n" +
            "   sepal_length  sepal_width  petal_length  petal_width species\n" +
            "0           5.1          3.5           1.4          0.2  setosa\n" +
            "1           4.9          3.0           1.4          0.2  setosa\n" +
            "2           4.7          3.2           1.3          0.2  setosa\n" +
            "3           4.6          3.1           1.5          0.2  setosa\n" +
            "4           5.0          3.6           1.4          0.2  setosa\n\n" +
            "Dataset Information\n" +
            "<class 'pandas.core.frame.DataFrame'>\n" +
            "RangeIndex: 150 entries, 0 to 149\n" +
            "Data columns (total 5 columns)\n" +
            "dtypes: float64(4), object(1)\n\n" +
            "Number of rows and colums :\n(150, 5)"
        },
        {
          id: "1b",
          label: "1B",
          title: "Reading and writing CSV files (remote + local)",
          summary: "Read a remote CSV, write it back to disk, then read a local CSV file.",
          problem: "Persist a downloaded dataset locally and reload it in a later session.",
          aim: "To read CSV data from a URL, write it to local files and read a local CSV file back.",
          algorithm: [
            "Read the remote Iris CSV into a DataFrame.",
            "Write all rows to iris_output.csv using to_csv().",
            "Write only the first five rows to student5csv.csv.",
            "Read the local file student5csvLocal.csv with read_csv().",
            "Print the head of the local data."
          ],
          inputFormat: "Remote CSV URL and a local CSV file.",
          expectedOutput: "Confirmation messages after each write and a preview of the local file.",
          sampleInput: 'url2 = "student5csvLocal.csv"',
          sampleOutput:
            "    Name Department Percentage\n0   kani         it         80\n1 shashi        cse         99",
          source: "DS-codes/experiment-1/1b.py",
          language: "python",
          video: "assets/videos/exp-1b.webm",
          recordedOutput:
            "   sepal_length  sepal_width  petal_length  petal_width species\n" +
            "0           5.1          3.5           1.4          0.2  setosa\n" +
            "1           4.9          3.0           1.4          0.2  setosa\n" +
            "2           4.7          3.2           1.3          0.2  setosa\n" +
            "3           4.6          3.1           1.5          0.2  setosa\n" +
            "4           5.0          3.6           1.4          0.2  setosa\n" +
            "Dataset of all rows successfully written to studentCSV.csv\n" +
            "Dataset of 5 rows successfully written to student5csv.csv\n" +
            "    Name Department Percentage\n0   kani         it         80\n1 shashi        cse         99"
        },
        {
          id: "1c",
          label: "1C",
          title: "Reading and writing delimited text files",
          summary: "Work with tab-separated .txt files using the sep argument.",
          problem: "Not all data is comma separated - read and write a tab separated text file.",
          aim: "To read a .txt file using a custom separator and to write a DataFrame back to text.",
          algorithm: [
            "Read the text file using pd.read_csv(path, sep='\\t').",
            "Print the student data.",
            "Build a new DataFrame from a Python dictionary.",
            "Write it back to the .txt file with sep='\\t' and index=False."
          ],
          inputFormat: "A tab separated .txt file.",
          expectedOutput: "The parsed table plus a success message after writing.",
          sampleInput: 'df = pd.read_csv("student.txt", sep="\\t")',
          sampleOutput: "Student Data:\n   Roll_num Name Department  Percentage ...",
          source: "DS-codes/experiment-1/1c.py",
          language: "python",
          video: "assets/videos/exp-1c.webm",
          recordedOutput:
            "Student Data:\n" +
            "   Roll_num Name Department  Percentage\n" +
            "0       101  ABC        CSE        92.5\n" +
            "1       102  DEF        ECE        89.0\n" +
            "2       103  GHI         IT        95.2\n" +
            "3       104  KLM       MECH        87.8\n" +
            "4       105  NOP      CIVIL        91.4\n" +
            "Succesffully written data in student.txt file"
        },
        {
          id: "1d",
          label: "1D",
          title: "Writing and reading JSON data",
          summary: "Serialise a DataFrame to JSON and parse JSON text back into a DataFrame.",
          problem: "JSON is the standard interchange format for web data - convert to and from it.",
          aim: "To write a DataFrame to a JSON file and to read JSON from a string.",
          algorithm: [
            "Create a DataFrame from a Python dictionary.",
            "Write it with df.to_json(..., orient='records', indent=4).",
            "Hold a JSON string in a variable.",
            "Parse it with pd.read_json(StringIO(json_data)).",
            "Print the parsed DataFrame."
          ],
          inputFormat: "A Python dictionary and a JSON string.",
          expectedOutput: "Confirmation of the file write and the parsed JSON table.",
          sampleInput: 'df.to_json("student.json", orient="records", indent=4)',
          sampleOutput:
            "Parsed data\n   Roll_no  Name  Marks\n0        1  Raju     99",
          source: "DS-codes/experiment-1/1d.py",
          language: "python",
          video: "assets/videos/exp-1d.webm",
          recordedOutput:
            "Successfully written in 'student.json'\n\n" +
            "Parsed data\n\n" +
            "   Roll_no  Name  Marks\n" +
            "0        1  Raju     99\n" +
            "1        2  Ravi     98\n" +
            "2        3  Ramu     97",
          isSample: true
        },
        {
          id: "1e",
          label: "1E",
          title: "Writing and reading Excel workbooks",
          summary: "Create single-sheet and multi-sheet Excel files and read them back.",
          problem: "Excel remains the most common format outside code - read and write it reliably.",
          aim: "To write DataFrames to Excel, including multiple sheets, and read all of them back.",
          algorithm: [
            "Write one DataFrame to student.xlsx.",
            "Create a second DataFrame for courses.",
            "Use pd.ExcelWriter to write both sheets into college_data.xlsx.",
            "Read the whole workbook with sheet_name=None.",
            "Print the available sheets and their contents."
          ],
          inputFormat: "Python dictionaries turned into DataFrames.",
          expectedOutput: "Success messages and the contents of the students and courses sheets.",
          sampleInput: 'with pd.ExcelWriter("college_data.xlsx", engine="openpyxl") as writer: ...',
          sampleOutput: "Available sheets:  ['students', 'courses']",
          source: "DS-codes/experiment-1/1e.py",
          language: "python",
          video: "assets/videos/exp-1e.webm",
          recordedOutput:
            "Data successfully written is student.xlsx\n" +
            "Multiple sheets successfully written to college_data.xlsx\n" +
            "Available sheets:\n['students', 'courses']\n\n" +
            "Student sheet:\n   Roll_no      Name Department  Marks\n" +
            "0      101    Vishnu         It     92\n" +
            "1      102  kanishka        cse     98\n\n" +
            "Courses sheet:\n  course_id       course_Name  credit\n" +
            "0      c101            python       9\n" +
            "1      c102               sql       8\n" +
            "2      c103  machine learning       9",
          isSample: true
        }
      ]
    },

    /* ================= EXPERIMENT 2 ================= */
    {
      id: 2,
      number: "2",
      title: "Web APIs & Databases",
      short: "Consume a REST API and perform CRUD operations on a SQLite database.",
      description:
        "Real applications get data from web services and relational databases. This experiment fetches JSON from a public REST API and turns it into a DataFrame, then creates and manipulates a table inside an SQLite database.",
      objective:
        "To fetch structured data over HTTP and to persist/query data using a lightweight SQL database.",
      concepts: ["requests", "REST API", "JSON", "sqlite3", "SQL CRUD", "read_sql_query"],
      outcome: "You will be able to pull API data into pandas and store or query records in SQLite.",
      image: "assets/images/hero-illustration.svg",
      subExperiments: [
        {
          id: "2a",
          label: "2A",
          title: "Fetching REST API data with requests",
          summary: "Call the GitHub issues API and load the JSON response into a DataFrame.",
          problem: "Web services return JSON - get that data into pandas with a couple of lines.",
          aim: "To call a REST endpoint and convert the JSON response into a pandas DataFrame.",
          algorithm: [
            "Import requests and pandas.",
            "GET the issues endpoint of the pandas GitHub repository.",
            "Convert the response to JSON with response.json().",
            "Build a DataFrame from the list of issues.",
            "Print the id, title, state and created_at columns."
          ],
          inputFormat: "An HTTP GET request to a public JSON endpoint.",
          expectedOutput: "A five-row table of issue id, title, state and creation date.",
          sampleInput: 'url = "https://api.github.com/repos/pandas-dev/pandas/issues"',
          sampleOutput: "           id                                  title state",
          source: "DS-codes/experiment-2/2a.py",
          language: "python",
          video: "assets/videos/exp-2a.webm",
          recordedOutput:
            "           id                                              title state            created_at\n" +
            "0  5132544163                   TRACKER: support for Python 3.15  open  2026-08-12T15:28:32Z\n" +
            "1  5131820781     CLN: share checked integer extern declarations  open  2026-08-12T14:11:31Z\n" +
            "2  5131484847  BUG: guard ArrowExtensionArray._replace_with_m...  open  2026-08-12T13:36:15Z\n" +
            "3  5130207908             DOC: add whatsnew entry for c++20 bump  open  2026-08-12T11:10:55Z\n" +
            "4  5130029826        ENH: Add excel_sep_hint parameter to to_csv  open  2026-08-12T10:48:23Z",
          note: "The API returns live data, so the exact rows change each time the code runs."
        },
        {
          id: "2b",
          label: "2B",
          title: "SQLite database CRUD with pandas",
          summary: "Create a table and run INSERT, SELECT, UPDATE and DELETE operations.",
          problem: "Store records in a relational database and read them back into a DataFrame.",
          aim: "To perform the four basic database operations using Python's built-in sqlite3 module.",
          algorithm: [
            "Connect to student.db and get a cursor.",
            "CREATE TABLE IF NOT EXISTS students.",
            "INSERT a row and commit.",
            "SELECT all rows into a DataFrame with read_sql_query.",
            "UPDATE the row, then DELETE it, printing after each step."
          ],
          inputFormat: "SQL statements executed through the sqlite3 cursor.",
          expectedOutput: "A DataFrame showing the inserted, updated and finally empty table.",
          sampleInput: 'cursor.execute("CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT)")',
          sampleOutput:
            "   id      name\n0   1  kanishka",
          source: "DS-codes/experiment-2/2b.py",
          language: "python",
          video: "assets/videos/exp-2b.webm",
          recordedOutput:
            "Table students craeted\n" +
            "Inserted successfully\n" +
            "   id  name\n0   1  kani\n" +
            "Updated\n\n" +
            "    id      name\n0   1  kanishka\n" +
            "After deleted\n\n" +
            "Empty DataFrame\nColumns: [id, name]\nIndex: []"
        },
        {
          id: "2c",
          label: "2C",
          title: "Storing API responses in SQLite (sample)",
          summary: "Combine requests + sqlite3 so API results survive between sessions.",
          problem: "API data is transient - persist it into a database in one step.",
          aim: "To fetch API JSON, keep selected columns and write them to an SQLite table with to_sql().",
          algorithm: [
            "Fetch the issues JSON from the GitHub API.",
            "Select the id, title, state and created_at columns.",
            "Write the DataFrame to the issues table using to_sql().",
            "Run a GROUP BY query to count issues per state."
          ],
          inputFormat: "An HTTP JSON response.",
          expectedOutput: "The number of rows stored and a state wise count.",
          sampleInput: 'df.to_sql("issues", conn, if_exists="replace", index=False)',
          sampleOutput: "Rows stored: 30\n    state  total\n0    open     30",
          source: "DS-codes/experiment-2/2c.py",
          language: "python",
          video: "assets/videos/exp-2c.webm",
          recordedOutput:
            "Rows stored: 30\n" +
            "   state  total\n" +
            "0   open     30",
          isSample: true,
          note: "Sample sub-experiment added so this unit has at least three parts. Replace it with your own exercise any time."
        }
      ]
    },

    /* ================= EXPERIMENT 3 ================= */
    {
      id: 3,
      number: "3",
      title: "Data Cleaning & Preprocessing",
      short: "Handle missing values, encode categories, detect outliers and clean text.",
      description:
        "Raw data is rarely ready for analysis. This experiment covers the standard preprocessing steps: finding and filling missing values, converting categories to numbers, spotting outliers and cleaning free text with regular expressions.",
      objective:
        "To apply the core pandas/numpy techniques that turn messy raw data into a clean, analysable dataset.",
      concepts: ["isna / dropna / fillna", "map & rename", "boolean masks", "outliers", "regular expressions"],
      outcome: "You will be able to assess data quality and apply the right cleaning technique for each problem.",
      image: "assets/images/hero-illustration.svg",
      subExperiments: [
        {
          id: "3a",
          label: "3A",
          title: "Detecting and handling missing values",
          summary: "Use isna(), dropna() and fillna() to deal with NaN entries.",
          problem: "Missing data breaks calculations - detect it and choose how to handle it.",
          aim: "To identify missing values and demonstrate two strategies: removing rows and filling values.",
          algorithm: [
            "Build a DataFrame that contains np.nan entries.",
            "Show the boolean mask of missing cells with df.isna().",
            "Drop incomplete rows with df.dropna().",
            "Fill missing cells with df.fillna(0).",
            "Print all three results."
          ],
          inputFormat: "A DataFrame containing NaN values.",
          expectedOutput: "A boolean mask, the cleaned DataFrame and the filled DataFrame.",
          sampleInput: "data = {'A': [1, 2, np.nan], 'B': [4, np.nan, np.nan]}",
          sampleOutput: "   A    B\n0  1.0  4.0",
          source: "DS-codes/experiment-3/3a.py",
          language: "python",
          video: "assets/videos/exp-3a.webm",
          recordedOutput:
            "       A      B\n0  False  False\n1  False   True\n2   True   True\n" +
            "     A    B\n0  1.0  4.0\n" +
            "     A    B\n0  1.0  4.0\n1  2.0  0.0\n2  0.0  0.0"
        },
        {
          id: "3b",
          label: "3B",
          title: "Encoding and renaming categorical columns",
          summary: "Convert text categories to numeric codes and rename columns.",
          problem: "Machine learning models need numbers - encode text categories and tidy column names.",
          aim: "To map categorical text values to numbers and rename a column.",
          algorithm: [
            "Create a DataFrame with a gender column.",
            "Map male/female to 0/1 using Series.map().",
            "Rename the gender column to Gender with df.rename().",
            "Print the transformed DataFrame."
          ],
          inputFormat: "A DataFrame with a text categorical column.",
          expectedOutput: "A DataFrame with a numeric gender column and a renamed header.",
          sampleInput: "df['gender_num'] = df['gender'].map({'male': 0, 'female': 1})",
          sampleOutput: "   Gender  gender_num\n0    male           0",
          source: "DS-codes/experiment-3/3b.py",
          language: "python",
          video: "assets/videos/exp-3b.webm",
          recordedOutput:
            "   Gender  gender_num\n" +
            "0    male           0\n" +
            "1  female           1\n" +
            "2    male           0"
        },
        {
          id: "3c",
          label: "3C",
          title: "Detecting outliers with boolean masks",
          summary: "Flag values beyond +/-3 standard deviations in random data.",
          problem: "Extreme values distort statistics - flag them before analysis.",
          aim: "To detect outliers using a vectorised boolean condition on a DataFrame.",
          algorithm: [
            "Generate a 100x3 DataFrame of standard normal values.",
            "Build a mask (data > 3) OR (data < -3).",
            "Sum the mask to count outliers per column."
          ],
          inputFormat: "Random numeric data.",
          expectedOutput: "The number of outliers found in each column.",
          sampleInput: "outliers = (data > 3) | (data < -3)",
          sampleOutput: "0    0\n1    0\n2    0\ndtype: int64",
          source: "DS-codes/experiment-3/3c.py",
          language: "python",
          video: "assets/videos/exp-3c.webm",
          recordedOutput: "0    0\n1    0\n2    0\ndtype: int64",
          note: "Because the data is random, the exact outlier count differs on each run."
        },
        {
          id: "3d",
          label: "3D",
          title: "Cleaning text with regular expressions",
          summary: "Split messy text on any whitespace run using re.split().",
          problem: "Text data contains tabs, newlines and multiple spaces that must be normalised.",
          aim: "To tokenise a string by splitting on one or more whitespace characters.",
          algorithm: [
            "Import the re module.",
            "Create a string containing tabs and newlines.",
            "Split it with re.split(r'\\s+', text).",
            "Print the resulting list of tokens."
          ],
          inputFormat: "A string with mixed whitespace.",
          expectedOutput: "A clean list of words.",
          sampleInput: 'text = "This is\\t a\\n test"',
          sampleOutput: "['This', 'is', 'a', 'test']",
          source: "DS-codes/experiment-3/3d.py",
          language: "python",
          video: "assets/videos/exp-3d.webm",
          recordedOutput: "['This', 'is', 'a', 'test']"
        }
      ]
    },

    /* ================= EXPERIMENT 4 ================= */
    {
      id: 4,
      number: "4",
      title: "Hierarchical Indexing & Reshaping",
      short: "Work with MultiIndex data and reshape it with stack/unstack.",
      description:
        "Hierarchical (multi-level) indexes let you represent grouped, higher-dimensional data inside a Series or DataFrame. This experiment builds a MultiIndex Series, selects from it, reshapes it and combines two DataFrames.",
      objective:
        "To understand multi-level indexing and the reshaping/combining operations used in advanced pandas workflows.",
      concepts: ["MultiIndex", "unstack", "stack", "combine_first", "reindexing"],
      outcome: "You will be able to model grouped data with MultiIndex and reshape between long and wide forms.",
      image: "assets/images/hero-illustration.svg",
      subExperiments: [
        {
          id: "4a",
          label: "4A",
          title: "Building a hierarchical (MultiIndex) Series",
          summary: "Create a two-level index and select data from each level.",
          problem: "Represent grouped observations without duplicating keys.",
          aim: "To construct a Series with a two-level index and select by outer and inner level.",
          algorithm: [
            "Generate six random values.",
            "Attach a two-level index of letters and numbers.",
            "Print the full Series.",
            "Select the 'b' group and the inner level equal to 1."
          ],
          inputFormat: "Random values with a nested index.",
          expectedOutput: "The full indexed Series and two selections.",
          sampleInput: "index=[['a','a','b','b','c','c'], [1,2,1,2,1,2]]",
          sampleOutput: "a  1   -2.166760\nb  1   -1.042996",
          source: "DS-codes/experiment-4/4a.py",
          language: "python",
          video: "assets/videos/exp-4a.webm",
          recordedOutput:
            "a  1   -2.166760\n   2   -1.658904\n" +
            "b  1   -1.042996\n   2   -0.651012\n" +
            "c  1    0.499757\n   2    0.421758\n" +
            "dtype: float64\n" +
            "1   -1.042996\n2   -0.651012\ndtype: float64\n" +
            "a   -2.166760\nb   -1.042996\nc    0.499757\ndtype: float64",
          note: "Values are random, so numbers differ on each run."
        },
        {
          id: "4b",
          label: "4B",
          title: "Reshaping with unstack() and stack()",
          summary: "Convert a MultiIndex Series to a wide DataFrame and back.",
          problem: "Move between long (stacked) and wide (tabular) layouts.",
          aim: "To reshape a hierarchical Series into a DataFrame and back to a Series.",
          algorithm: [
            "Build a MultiIndex Series.",
            "Call unstack() to get a wide DataFrame.",
            "Call stack() on the result to return to a Series.",
            "Print both stages."
          ],
          inputFormat: "A MultiIndex Series.",
          expectedOutput: "A wide DataFrame followed by its stacked form.",
          sampleInput: "df = data.unstack()",
          sampleOutput: "          1         2\na -2.166760 -1.658904",
          source: "DS-codes/experiment-4/4b.py",
          language: "python",
          video: "assets/videos/exp-4b.webm",
          recordedOutput:
            "          1         2\na -2.166760 -1.658904\nb -1.042996 -0.651012\nc  0.499757  0.421758\n" +
            "a  1   -2.166760\n   2   -1.658904\nb  1   -1.042996\n" +
            "   2   -0.651012\nc  1    0.499757\n   2    0.421758\ndtype: float64"
        },
        {
          id: "4c",
          label: "4C",
          title: "Combining DataFrames with combine_first()",
          summary: "Fill the gaps of one DataFrame using the values of another.",
          problem: "Two data sources partially overlap - merge them preferring the first.",
          aim: "To use combine_first() to patch missing values in one DataFrame with another.",
          algorithm: [
            "Create two DataFrames with some NaN values.",
            "Call df1.combine_first(df2).",
            "Print the merged DataFrame."
          ],
          inputFormat: "Two DataFrames with overlapping columns.",
          expectedOutput: "A DataFrame where missing cells from df1 are taken from df2.",
          sampleInput: "merged = df1.combine_first(df2)",
          sampleOutput: "     a    b\n0  1.0  4.0\n1  8.0  5.0\n2  3.0  6.0",
          source: "DS-codes/experiment-4/4c.py",
          language: "python",
          video: "assets/videos/exp-4c.webm",
          recordedOutput: "     a    b\n0  1.0  4.0\n1  8.0  5.0\n2  3.0  6.0"
        }
      ]
    },

    /* ================= EXPERIMENT 5 ================= */
    {
      id: 5,
      number: "5",
      title: "Data Visualization with Matplotlib & Seaborn",
      short: "Build line, bar, histogram, scatter and box plots from pandas data.",
      description:
        "Visualisation turns numbers into insight. This experiment creates the five most common chart types using matplotlib and seaborn, including a histogram with a density curve and a statistical box plot.",
      objective:
        "To create and interpret the core chart types used during exploratory data analysis.",
      concepts: ["matplotlib.pyplot", "seaborn", "plot kinds", "kde", "charts", "plt.show"],
      outcome: "You will be able to choose and generate a suitable chart for different data questions.",
      image: "assets/images/hero-illustration.svg",
      subExperiments: [
        {
          id: "5a",
          label: "5A",
          title: "Line plot with matplotlib",
          summary: "Plot a simple x-y relationship, add labels, grid and save to PNG.",
          problem: "Show a trend over an ordered variable.",
          aim: "To draw a titled, labelled line chart and save it as an image.",
          algorithm: [
            "Define x and y lists.",
            "Call plt.plot(x, y).",
            "Add title and axis labels and enable the grid.",
            "Save the figure with plt.savefig() and display it."
          ],
          inputFormat: "Two numeric lists.",
          expectedOutput: "A rendered line chart saved as line_plot.png.",
          sampleInput: "x = [1,2,3,4]\ny = [10,20,25,30]",
          sampleOutput: "line_plot.png",
          source: "DS-codes/experiment-5/5a.py",
          language: "python",
          video: "assets/videos/exp-5a.webm",
          recordedOutput: "<Figure size 640x480 with 1 Axes>",
          note: "In a plain script the figure window opens; run it in Jupyter or save the PNG to inspect it."
        },
        {
          id: "5b",
          label: "5B",
          title: "Bar plot from a DataFrame",
          summary: "Compare categories with a bar chart.",
          problem: "Compare a value across discrete categories.",
          aim: "To build a bar chart directly from a pandas DataFrame.",
          algorithm: [
            "Create a DataFrame with a category column and a value column.",
            "Call df.plot(kind='bar', x='category', y='values').",
            "Set the title and display the chart."
          ],
          inputFormat: "A DataFrame with categorical and numeric columns.",
          expectedOutput: "A bar chart titled BarPlot.",
          sampleInput: "df.plot(kind='bar', x='category', y='values')",
          sampleOutput: "<Figure size 640x480 with 1 Axes>",
          source: "DS-codes/experiment-5/5b.py",
          language: "python",
          video: "assets/videos/exp-5b.webm",
          recordedOutput: "<Figure size 640x480 with 1 Axes>"
        },
        {
          id: "5c",
          label: "5C",
          title: "Histogram with a density curve",
          summary: "Visualise the distribution of 1000 random values with KDE.",
          problem: "Understand the distribution and shape of one variable.",
          aim: "To plot a histogram with an overlaid kernel density estimate using seaborn.",
          algorithm: [
            "Generate 1000 normally distributed values.",
            "Call sns.histplot(data, kde=True).",
            "Set the title and display the chart."
          ],
          inputFormat: "A numeric array.",
          expectedOutput: "A histogram with a smooth density curve.",
          sampleInput: "sns.histplot(data, kde=True)",
          sampleOutput: "<Figure size 640x480 with 1 Axes>",
          source: "DS-codes/experiment-5/5c.py",
          language: "python",
          video: "assets/videos/exp-5c.webm",
          recordedOutput: "<Figure size 640x480 with 1 Axes>"
        },
        {
          id: "5d",
          label: "5D",
          title: "Scatter plot of two variables",
          summary: "Inspect the relationship between two random variables.",
          problem: "Look for correlation between two numeric variables.",
          aim: "To produce a labelled scatter plot of two equal-length random arrays.",
          algorithm: [
            "Generate two arrays of 50 random values.",
            "Call plt.scatter(x, y).",
            "Add a title and axis labels and display the chart."
          ],
          inputFormat: "Two equal-length numeric arrays.",
          expectedOutput: "A scatter plot titled Scatter plot.",
          sampleInput: "plt.scatter(x, y)",
          sampleOutput: "<Figure size 640x480 with 1 Axes>",
          source: "DS-codes/experiment-5/5d.py",
          language: "python",
          video: "assets/videos/exp-5d.webm",
          recordedOutput: "<Figure size 640x480 with 1 Axes>"
        },
        {
          id: "5e",
          label: "5E",
          title: "Box plot for distribution summary",
          summary: "Summarise spread, median and outliers with a box plot.",
          problem: "Compare the spread and outliers of numeric data at a glance.",
          aim: "To draw a box plot using seaborn and describe its quartiles.",
          algorithm: [
            "Generate a large array of random values.",
            "Call sns.boxplot(data=...).",
            "Set the title and display the chart."
          ],
          inputFormat: "A numeric array.",
          expectedOutput: "A box plot showing median, quartiles and outliers.",
          sampleInput: "sns.boxplot(data=np.random.randn(10014))",
          sampleOutput: "<Figure size 640x480 with 1 Axes>",
          source: "DS-codes/experiment-5/5e.py",
          language: "python",
          video: "assets/videos/exp-5e.webm",
          recordedOutput: "<Figure size 640x480 with 1 Axes>"
        }
      ]
    },

    /* ================= EXPERIMENT 6 ================= */
    {
      id: 6,
      number: "6",
      title: "Time Series Analysis with pandas",
      short: "Datetime indexes, date ranges, time zones, periods and resampling.",
      description:
        "Time series data is central to analytics. This experiment works through the pandas time tools: building datetime-indexed Series, generating date ranges, handling time zones, doing Period arithmetic, changing frequency and resampling between hourly and sub-hourly data.",
      objective:
        "To work confidently with dates, times, time zones and resampling in pandas.",
      concepts: ["to_datetime", "date_range", "tz_localize / tz_convert", "Period", "asfreq", "resample"],
      outcome: "You will be able to index data by time, convert frequencies and aggregate time series.",
      image: "assets/images/hero-illustration.svg",
      subExperiments: [
        {
          id: "6a",
          label: "6A",
          title: "Creating a time series",
          summary: "Build a Series indexed by calendar dates.",
          problem: "Attach a datetime index to observations so they can be analysed over time.",
          aim: "To create a pandas Series whose index is a DatetimeIndex.",
          algorithm: [
            "Convert a list of date strings with pd.to_datetime().",
            "Create a Series of temperatures indexed by those dates.",
            "Print the time series."
          ],
          inputFormat: "A list of date strings and a list of values.",
          expectedOutput: "A Series indexed by dates.",
          sampleInput: "time_series = pd.Series(temperature, index=dates)",
          sampleOutput: "2026-01-01    28\n2026-01-02    30",
          source: "DS-codes/experiment-6/6a.py",
          language: "python",
          video: "assets/videos/exp-6a.webm",
          recordedOutput:
            "Time Series:\n" +
            "2026-01-01    28\n2026-01-02    30\n2026-01-03    29\n2026-01-04    31\n2026-01-05    32\ndtype: int64"
        },
        {
          id: "6b",
          label: "6B",
          title: "Generating date ranges",
          summary: "Create evenly spaced dates with pd.date_range().",
          problem: "Generate a regular calendar index for a given number of periods.",
          aim: "To build a DatetimeIndex with a start date, period count and frequency.",
          algorithm: [
            "Call pd.date_range(start='2026-01-01', periods=7, freq='D').",
            "Print the generated index."
          ],
          inputFormat: "A start date, a number of periods and a frequency.",
          expectedOutput: "Seven consecutive daily timestamps.",
          sampleInput: "pd.date_range(start='2026-01-01', periods=7, freq='D')",
          sampleOutput: "DatetimeIndex(['2026-01-01', ... '2026-01-07'], dtype='datetime64[ns]')",
          source: "DS-codes/experiment-6/6b.py",
          language: "python",
          video: "assets/videos/exp-6b.webm",
          recordedOutput:
            "Generated DatetimeIndex:\n" +
            "DatetimeIndex(['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04',\n" +
            "               '2026-01-05', '2026-01-06', '2026-01-07'],\n" +
            "              dtype='datetime64[ns]', freq='D')"
        },
        {
          id: "6c",
          label: "6C",
          title: "Time zone handling",
          summary: "Localise and convert timestamps between time zones.",
          problem: "The same instant is a different wall-clock time in different zones.",
          aim: "To create timezone-aware timestamps, localise naive ones and convert between zones.",
          algorithm: [
            "Create a date range with tz='Asia/Kolkata'.",
            "Create a naive date range and localise it to Asia/Kolkata.",
            "Convert the localised index to America/New_York.",
            "Build Series on both indexes and concatenate them."
          ],
          inputFormat: "A start time, period count and time zone.",
          expectedOutput: "Timestamp/index output for each conversion step.",
          sampleInput: "dates.tz_localize('Asia/Kolkata').tz_convert('America/New_York')",
          sampleOutput: "2. Timezone-naive Date Range: 2026-01-01 09:00:00",
          source: "DS-codes/experiment-6/6c.py",
          language: "python",
          video: "assets/videos/exp-6c.webm",
          recordedOutput:
            "1. Date Range with Asia/Kolkata Time Zone:\n" +
            "DatetimeIndex(['2026-01-01 09:00:00+05:30', '2026-01-01 10:00:00+05:30',\n" +
            "               '2026-01-01 11:00:00+05:30'], dtype='datetime64[ns, Asia/Kolkata]', freq='h')\n\n" +
            "2. Timezone-naive Date Range:\nDatetimeIndex(['2026-01-01 09:00:00', ...], dtype='datetime64[ns]', freq='h')\n\n" +
            "3. After Localizing to Asia/Kolkata:\nDatetimeIndex([...], dtype='datetime64[ns, Asia/Kolkata]', freq='h')\n\n" +
            "4. Converted to America/New_York:\nDatetimeIndex(['2025-12-31 22:30:00-05:00', ...], dtype='datetime64[ns, America/New_York]', freq='h')\n\n" +
            "6. Combined Time Series:\n2026-01-01 09:00:00+05:30    100\n2026-01-01 10:00:00+05:30    200\n2026-01-01 11:00:00+05:30    300\ndtype: int64"
        },
        {
          id: "6d",
          label: "6D",
          title: "Period arithmetic",
          summary: "Create pandas Periods and add/subtract months.",
          problem: "Do calendar-aware arithmetic such as moving forward N months.",
          aim: "To create a monthly Period, shift it by whole numbers and build a period_range.",
          algorithm: [
            "Create p = pd.Period('2026-01', freq='M').",
            "Print p, p+2, p+5, p-1 and p-3.",
            "Create a six-month period_range and print it."
          ],
          inputFormat: "A month string and integers to shift by.",
          expectedOutput: "The original period, shifted periods and a period range.",
          sampleInput: "p = pd.Period('2026-01', freq='M')",
          sampleOutput: "Period('2026-03', 'M')",
          source: "DS-codes/experiment-6/6d.py",
          language: "python",
          video: "assets/videos/exp-6d.webm",
          recordedOutput:
            "Original Period:\nPeriod('2026-01', 'M')\n" +
            "After adding 2:\nPeriod('2026-03', 'M')\n" +
            "After adding 5:\nPeriod('2026-06', 'M')\n" +
            "After subtracting 1:\nPeriod('2025-12', 'M')\n" +
            "Range of Periods:\nPeriodIndex(['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'], dtype='period[M]')"
        },
        {
          id: "6e",
          label: "6E",
          title: "Converting Period frequency (asfreq)",
          summary: "Change a monthly Period to daily start/end frequency.",
          problem: "Convert a coarse period into a finer frequency.",
          aim: "To use asfreq() on a Period and a PeriodIndex to change frequency.",
          algorithm: [
            "Create a monthly Period.",
            "Convert it to daily with how='start' and how='end'.",
            "Build a PeriodIndex and apply asfreq('D') to it.",
            "Print every stage."
          ],
          inputFormat: "A monthly Period.",
          expectedOutput: "Daily conversions for both a single Period and a PeriodIndex.",
          sampleInput: "p.asfreq('D', how='start')",
          sampleOutput: "Period('2026-01-01', 'D')",
          source: "DS-codes/experiment-6/6e.py",
          language: "python",
          video: "assets/videos/exp-6e.webm",
          recordedOutput:
            "Original Period:\nPeriod('2026-01', 'M')\n" +
            "Monthly Period converted to Daily (Start):\nPeriod('2026-01-01', 'D')\n" +
            "Monthly Period converted to Daily (End):\nPeriod('2026-01-31', 'D')\n" +
            "PeriodIndex converted to Daily Frequency:\nPeriodIndex(['2026-01-01', '2026-02-01', '2026-03-01'], dtype='period[D]')"
        },
        {
          id: "6f",
          label: "6F",
          title: "Converting timestamps to periods",
          summary: "Use to_period() on Series and DataFrames.",
          problem: "Aggregate dated records into months for reporting.",
          aim: "To convert a datetime-indexed Series and DataFrame into monthly periods.",
          algorithm: [
            "Create a datetime-indexed sales Series.",
            "Call to_period('M') on the Series.",
            "Create a DataFrame and call to_period('M') on it."
          ],
          inputFormat: "Datetime-indexed data.",
          expectedOutput: "The same data with a monthly Period index.",
          sampleInput: "sales.to_period('M')",
          sampleOutput: "2026-01    1000\nFreq: M",
          source: "DS-codes/experiment-6/6f.py",
          language: "python",
          video: "assets/videos/exp-6f.webm",
          recordedOutput:
            "Original Series:\n2026-01-10    1000\n2026-02-15    1500\n2026-03-20    1800\n2026-04-25    2200\nFreq: None\n" +
            "Series converted to Monthly Periods:\n2026-01    1000\n2026-02    1500\n2026-03    1800\n2026-04    2200\nFreq: M"
        },
        {
          id: "6g",
          label: "6G",
          title: "Resampling time series",
          summary: "Downsample to 3h/4h and upsample to 30 minutes.",
          problem: "Change the time resolution of a series to summarise or interpolate it.",
          aim: "To resample an hourly Series using mean, sum, asfreq and forward fill.",
          algorithm: [
            "Create an hourly time series of 12 points.",
            "Resample to 3-hourly means.",
            "Resample to 4-hourly sums.",
            "Upsample to 30 minutes using asfreq and then ffill."
          ],
          inputFormat: "An hourly time series.",
          expectedOutput: "Four resampled views of the same data.",
          sampleInput: "time_series.resample('3h').mean()",
          sampleOutput: "2026-01-01 00:00    12.333333",
          source: "DS-codes/experiment-6/6g.py",
          language: "python",
          video: "assets/videos/exp-6g.webm",
          recordedOutput:
            "Resampled Time Series - 3 Hour Mean:\n" +
            "2026-01-01 00:00:00    12.333333\n2026-01-01 03:00:00    17.333333\n2026-01-01 06:00:00    22.666667\n2026-01-01 09:00:00    30.000000\nFreq: 3h\n\n" +
            "Downsampled Time Series - 4 Hour Sum:\n2026-01-01 00:00:00    51\n2026-01-01 04:00:00    76\n2026-01-01 08:00:00   115\nFreq: 4h"
        }
      ]
    },

    /* ================= EXPERIMENT 7 ================= */
    {
      id: 7,
      number: "7",
      title: "GroupBy & Aggregation",
      short: "Split data into groups and compute aggregate statistics.",
      description:
        "The split-apply-combine pattern is at the heart of data analysis. This experiment groups records by one or more keys, aggregates numeric columns with multiple functions and applies GroupBy to the real Iris dataset.",
      objective:
        "To use pandas GroupBy to summarise data by category and by category + subcategory.",
      concepts: ["groupby", "aggregate", "mean/sum/std", "multi-key grouping", "value_counts"],
      outcome: "You will be able to produce grouped summary statistics for any categorical dataset.",
      image: "assets/images/hero-illustration.svg",
      subExperiments: [
        {
          id: "7a",
          label: "7A",
          title: "Basic GroupBy operations",
          summary: "Group by one and two columns and iterate over the groups.",
          problem: "Summarise student marks by department and by department + year.",
          aim: "To group a DataFrame by one and two keys and compute the average marks per group.",
          algorithm: [
            "Create a student DataFrame.",
            "Group by Department and iterate over each group.",
            "Compute the mean marks per department.",
            "Group by Department and Year and repeat."
          ],
          inputFormat: "A DataFrame with categorical and numeric columns.",
          expectedOutput: "Printed groups and average marks per group.",
          sampleInput: "df.groupby('Department')['Marks'].mean()",
          sampleOutput: "Department\nCSE    83.33\nECE    84.50",
          source: "DS-codes/experiment-7/7a.py",
          language: "python",
          video: "assets/videos/exp-7a.webm",
          recordedOutput:
            "Average Marks by Department:\n" +
            "Department\nCSE    83.333333\nECE    84.500000\nName: Marks, dtype: float64\n\n" +
            "Average Marks by Department and Year:\n" +
            "Department  Year\nCSE         2       85.0\n            3       95.0\nECE         2       70.0\n            3       85.0\nName: Marks, dtype: float64"
        },
        {
          id: "7b",
          label: "7B",
          title: "Aggregate summary statistics",
          summary: "Apply sum, mean and std to multiple columns at once.",
          problem: "Produce a compact summary table for several metrics.",
          aim: "To use groupby().aggregate() with a dictionary of column-to-function lists.",
          algorithm: [
            "Create a DataFrame with Marks and Attendance columns.",
            "Group by Department.",
            "Aggregate with sum, mean and std for both columns.",
            "Print the summary table."
          ],
          inputFormat: "A DataFrame with one key and several numeric columns.",
          expectedOutput: "A multi-level summary table of statistics per department.",
          sampleInput: "df.groupby('Department').aggregate({'Marks': ['sum','mean','std']})",
          sampleOutput: "           Marks                   Attendance",
          source: "DS-codes/experiment-7/7b.py",
          language: "python",
          video: "assets/videos/exp-7b.webm",
          recordedOutput:
            "Summary Statistics:\n" +
            "             Marks                Attendance\n" +
            "               sum   mean       std        sum  mean        std\n" +
            "Department\n" +
            "CSE          240.0  80.00  5.000000      270.0  90.0   5.000000\n" +
            "ECE          210.0  70.00  5.000000      240.0  80.0   5.000000\n" +
            "EEE          270.0  90.00  5.000000      285.0  95.0   5.000000"
        },
        {
          id: "7c",
          label: "7C",
          title: "GroupBy on the Iris dataset",
          summary: "Group the Iris flower dataset by species and summarise every feature.",
          problem: "Apply GroupBy techniques to a real, published dataset.",
          aim: "To compute count, mean, std, min and max per species for all numeric features.",
          algorithm: [
            "Load the Iris dataset from the web.",
            "Show head, info and describe outputs.",
            "Group by species and aggregate sepal/petal columns.",
            "Count records per species and report per-species means."
          ],
          inputFormat: "The Iris CSV dataset.",
          expectedOutput: "Per-species statistics for every numeric feature.",
          sampleInput: "df.groupby('species').agg({'sepal_length': ['mean','std']})",
          sampleOutput: "species\nsetosa    5.006\nversicolor 5.936\nvirginica  6.588",
          source: "DS-codes/experiment-7/7c.py",
          language: "python",
          video: "assets/videos/exp-7c.webm",
          recordedOutput:
            "4. Number of Records in Each Species:\n" +
            "species\nsetosa        50\nversicolor    50\nvirginica      50\nName: count, dtype: int64\n\n" +
            "Average Petal Length by Species:\n" +
            "species\nsetosa        1.462\nversicolor    4.260\nvirginica     5.552\nName: petal_length, dtype: float64\n\n" +
            "Maximum Sepal Length by Species:\n" +
            "species\nsetosa        5.8\nversicolor    7.0\nvirginica     7.9\nName: sepal_length, dtype: float64"
        }
      ]
    }
  ];

  /* ---------------------------------------------------------------- *
   *  Derived helpers (used for statistics counters and lookups)
   * ---------------------------------------------------------------- */
  function totalSubExperiments() {
    return EXPERIMENTS.reduce((sum, e) => sum + e.subExperiments.length, 0);
  }

  function findExperiment(id) {
    return EXPERIMENTS.find((e) => String(e.id) === String(id)) || null;
  }

  function findSubExperiment(expId, subId) {
    const exp = findExperiment(expId);
    if (!exp) return null;
    return exp.subExperiments.find((s) => s.id.toLowerCase() === String(subId).toLowerCase()) || null;
  }

  function allSubExperiments() {
    return EXPERIMENTS.flatMap((e) => e.subExperiments.map((s) => ({ ...s, experimentId: e.id })));
  }

  window.APP_DATA = {
    MODULES,
    EXPERIMENTS,
    totalSubExperiments,
    findExperiment,
    findSubExperiment,
    allSubExperiments
  };
})();
