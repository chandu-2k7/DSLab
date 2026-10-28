import os
from generate_module_pdfs import build_pdf

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "pdfs"))

# =========================================================================
# MODULE 1
# =========================================================================
mod1_sections = [
    {"type": "h1", "text": "1. Definition of Data Science"},
    {"type": "p", "text": "<b>Data Science (DS):</b> Study and practice of collecting, storing, processing, and analyzing data to extract meaningful insights and support decision-making. It includes scientific methods, computational thinking, and systematic analysis of data. DS combines computer science, statistics, mathematics, and domain expertise."},
    {"type": "p", "text": "<b>The 3Vs of data that justify its rise:</b>"},
    {"type": "bullet", "text": "<b>Volume:</b> Massive amounts of data generated globally (e.g., zettabytes). By 2020, global data usage exceeded 40 zettabytes—a 50-fold increase since 2010."},
    {"type": "bullet", "text": "<b>Velocity:</b> Speed at which data is continuously generated, streamed, and processed in real time."},
    {"type": "bullet", "text": "<b>Variety:</b> Heterogeneous structured and unstructured data formats including tabular databases, text, images, audio, video, sensor readings, and logs."},
    {"type": "p", "text": "Data science is used to derive meaningful insights to solve real-world problems through systematic, repeatable, and verifiable processes."},

    {"type": "h1", "text": "2. Where Do We See Data Science?"},
    {"type": "p", "text": "Data science finds widespread application across diverse domains to extract actionable intelligence from complex datasets:"},
    {"type": "bullet", "text": "<b>Finance:</b> Fraud detection, algorithmic trading, credit risk assessment, customer segmentation, loan underwriting, and portfolio management."},
    {"type": "bullet", "text": "<b>Public Policy:</b> Analysis of citizen behavior, traffic flow, resource utilization, and evidence-based policymaking on open data platforms (e.g., data.gov)."},
    {"type": "bullet", "text": "<b>Politics:</b> Voter profiling, targeted campaign outreach, and social media sentiment analysis."},
    {"type": "bullet", "text": "<b>Healthcare:</b> Disease diagnosis, electronic health record (EHR) analytics, wearable fitness telemetry, and personalized treatment plans."},
    {"type": "bullet", "text": "<b>Urban Planning:</b> Smart city initiatives, intelligent traffic signal synchronization, energy grid optimization (e.g., Chicago Plow Tracker, Boston SnowCOP)."},
    {"type": "bullet", "text": "<b>Education:</b> Personalized adaptive learning, student retention forecasting, and automated academic intervention."},
    {"type": "bullet", "text": "<b>Libraries & Information Science:</b> Automated systematic literature reviews, semantic metadata indexing, and citation network mapping."},
    {"type": "bullet", "text": "<b>Business & E-commerce:</b> Consumer behavior analysis, recommendation systems (Amazon, Netflix), customer lifetime value (CLV), and churn prevention."},
    {"type": "bullet", "text": "<b>Industrial & Manufacturing:</b> Predictive equipment maintenance, supply chain optimization, IoT sensor telemetry, and automated quality assurance."},

    {"type": "h1", "text": "3. Skills for Data Science"},
    {"type": "p", "text": "A successful data scientist combines curiosity, rigorous mathematical reasoning, and hands-on technical proficiency:"},
    {"type": "bullet", "text": "<b>Willingness to Experiment:</b> Curious, creative mindset defining hypotheses and exploring data through open-ended exploration."},
    {"type": "bullet", "text": "<b>Mathematical & Statistical Reasoning:</b> Solid understanding of probability distributions, hypothesis testing, linear algebra, and multivariable calculus."},
    {"type": "bullet", "text": "<b>Data Literacy:</b> The ability to read, interpret, critically evaluate, and communicate insights from complex data."},
    {"type": "h2", "text": "Core Industry Roles in Data Science:"},
    {"type": "bullet", "text": "<b>Data Analyst:</b> Focuses on descriptive analytics, SQL querying, reporting, and dashboard visualization (Excel, Tableau, Power BI)."},
    {"type": "bullet", "text": "<b>Data Engineer:</b> Builds scalable data pipelines, ETL infrastructure, distributed storage, and data warehousing systems."},
    {"type": "bullet", "text": "<b>Product-Focused Data Scientist:</b> Designs data-driven features and production ML services (recommendation engines, ranking models)."},
    {"type": "bullet", "text": "<b>Generalist Data Scientist:</b> Handles end-to-end workflows across modeling, visualization, data munging, and stakeholder communication."},

    {"type": "h1", "text": "4. Primary Tools for Data Science"},
    {"type": "bullet", "text": "<b>Python:</b> Interpreted, high-level programming language with an unmatched data science ecosystem: pandas, NumPy, SciPy, Matplotlib, Seaborn, scikit-learn, PyTorch, and TensorFlow."},
    {"type": "bullet", "text": "<b>R:</b> Specialized statistical programming environment designed for statistical modeling, hypothesis testing, ggplot2 visualization, and reproducible RMarkdown reporting."},
    {"type": "bullet", "text": "<b>SQL (Structured Query Language):</b> Standard domain-specific language for relational database querying, filtering, table joins, aggregations, and high-performance in-database data extraction."},
    {"type": "bullet", "text": "<b>UNIX / Shell:</b> Command-line utilities (grep, awk, sed, curl, bash) for file manipulation, log filtering, script automation, and remote server workflow execution."},

    {"type": "h1", "text": "5. Data Types & Storage Formats"},
    {"type": "p", "text": "Data is primarily classified as <b>Structured</b> (neatly organized tabular records with explicit schema and column labels, easily queried via SQL or pandas) or <b>Unstructured</b> (free text, images, video, sensor streams, requiring specialized natural language processing or computer vision pipelines)."},
    {"type": "h2", "text": "Common Storage Formats:"},
    {"type": "bullet", "text": "<b>CSV (Comma-Separated Values):</b> Lightweight plain text with comma delimiters, universally supported across spreadsheet and data analysis tools."},
    {"type": "bullet", "text": "<b>TSV (Tab-Separated Values):</b> Plain text using tab separators, reducing delimiter conflicts when fields contain commas."},
    {"type": "bullet", "text": "<b>XML (eXtensible Markup Language):</b> Hierarchical, self-describing tagged data format for cross-platform data exchange."},
    {"type": "bullet", "text": "<b>RSS Feeds:</b> Standardized XML syndication for delivering continuous updates, articles, and notifications to subscribers."},

    {"type": "h1", "text": "6. Data Preprocessing Pipeline"},
    {"type": "p", "text": "Real-world raw data is inherently dirty: containing missing entries, outliers, noise, and schema inconsistencies. Preprocessing transforms raw inputs into reliable data:"},
    {"type": "bullet", "text": "<b>Data Cleaning:</b> Correcting erroneous values, eliminating duplicates, and standardizing categorical labels."},
    {"type": "bullet", "text": "<b>Data Munging / Wrangling:</b> Reshaping and reformatting data structures for downstream analytical models."},
    {"type": "bullet", "text": "<b>Handling Missing Values:</b> Dropping records, mean/median/mode imputation, forward/backward filling, or predictive imputation."},
    {"type": "bullet", "text": "<b>Noise Smoothing:</b> Outlier detection (z-score, IQR filtering), binning, moving average smoothing."},
    {"type": "bullet", "text": "<b>Data Integration:</b> Merging heterogeneous tables, resolving entity resolution conflicts, and deduplication."},
    {"type": "bullet", "text": "<b>Data Reduction:</b> Dimensionality reduction (PCA, SVD) and summary aggregation without loss of critical variance."},
    {"type": "bullet", "text": "<b>Data Discretization:</b> Binning continuous variables into nominal or ordinal intervals (e.g., low, medium, high)."},

    {"type": "h1", "text": "7. Data Analysis vs. Data Analytics (6 Methodologies)"},
    {"type": "p", "text": "While <i>data analysis</i> examines historical data to understand past events (retrospective), <i>data analytics</i> builds predictive and prescriptive frameworks to anticipate outcomes and guide future decisions."},
    {"type": "table", "data": [
        ["Analytical Category", "Focus / Core Question", "Primary Methodologies / Examples"],
        ["Descriptive Analysis", "What is happening now?", "Summary statistics, frequency tables, census counts"],
        ["Diagnostic Analytics", "Why did it happen?", "Causal analysis, correlation analysis, anomaly drill-downs"],
        ["Predictive Analytics", "What will happen next?", "Machine learning models, regression forecasting, risk scoring"],
        ["Prescriptive Analytics", "What is the best course of action?", "Optimization algorithms, simulation, decision trees, game theory"],
        ["Exploratory Analysis (EDA)", "What patterns exist without prior hypothesis?", "Visual exploration, scatter matrices, clustering discovery"],
        ["Mechanistic Analysis", "How do specific physical changes cause effects?", "Deterministic regression modeling (y = β₀ + β₁x), scientific laws"]
    ], "colWidths": [130, 150, 260]},

    {"type": "h1", "text": "8. Descriptive Statistics & Dispersion Metrics"},
    {"type": "p", "text": "<b>Measures of Central Tendency:</b>"},
    {"type": "bullet", "text": "<b>Mean:</b> Arithmetic average (sensitive to extreme outliers)."},
    {"type": "bullet", "text": "<b>Median:</b> Middle value of sorted data (robust against skewness)."},
    {"type": "bullet", "text": "<b>Mode:</b> Most frequently occurring value (ideal for categorical data)."},
    {"type": "p", "text": "<b>Measures of Dispersion:</b>"},
    {"type": "bullet", "text": "<b>Range:</b> Difference between maximum and minimum values."},
    {"type": "bullet", "text": "<b>Interquartile Range (IQR):</b> Spread of the middle 50% of observations (Q3 - Q1), minimizing outlier distortion."},
    {"type": "bullet", "text": "<b>Population Variance (σ²):</b> σ² = Σ(Xᵢ - μ)² / N"},
    {"type": "bullet", "text": "<b>Sample Variance (s²):</b> s² = Σ(xᵢ - x̄)² / (n - 1) with Bessel's correction to eliminate sample bias."},
    {"type": "bullet", "text": "<b>Standard Deviation (s):</b> s = √[Σ(xᵢ - x̄)² / (n - 1)], expressed in the original units of measurement."}
]

# =========================================================================
# MODULE 2
# =========================================================================
mod2_sections = [
    {"type": "h1", "text": "1. Extracting Meaning from Data: Industry Approaches"},
    {"type": "p", "text": "Organizations leverage two primary complementary philosophies to extract actionable value from data:"},
    {"type": "bullet", "text": "<b>William Cukierski (Kaggle):</b> Focuses on feature engineering, competitive crowd-sourced modeling, and iterative leaderboard refinement. Kaggle challenges invite data scientists globally to build predictive models on concealed test splits, sparking continuous benchmark breakthroughs ('leapfrogging')."},
    {"type": "bullet", "text": "<b>David Huffaker (Google):</b> Advocates for a mixed-methods philosophy combining large-scale behavioral telemetry with qualitative user research (interviews, ethnographic observation). Emphasizes user retention modeling, predictive lifetime value, and strict data privacy ethics."},

    {"type": "h1", "text": "2. Feature Selection Fundamentals"},
    {"type": "p", "text": "<b>Features</b> are individual measurable variables describing observed phenomena. <b>Feature selection</b> isolates the optimal subset of attributes that contribute meaningfully to model accuracy while eliminating redundancy."},
    {"type": "bullet", "text": "<b>Minimizing Overfitting:</b> Eliminating noise and irrelevant features prevents models from memorizing training idiosyncrasies."},
    {"type": "bullet", "text": "<b>Boosting Computational Efficiency:</b> Smaller feature matrices drastically decrease training, memory, and inference latency."},
    {"type": "bullet", "text": "<b>Improving Interpretability:</b> Compact feature spaces enable stakeholders to understand causal mechanisms and trust model predictions."},

    {"type": "h1", "text": "3. Four Approaches to Feature Selection"},
    {"type": "bullet", "text": "<b>Filter Methods:</b> Rank features independently of model algorithms using statistical metrics (Pearson correlation, Chi-square test, mutual information, ANOVA). Fast and scalable."},
    {"type": "bullet", "text": "<b>Wrapper Methods:</b> Evaluate subsets of features by training and scoring a predictive model. Example: Recursive Feature Elimination (RFE). Highly accurate but computationally intensive."},
    {"type": "bullet", "text": "<b>Embedded Methods:</b> Feature selection occurs naturally during algorithm optimization. Examples: Lasso (L1 regularization shrinking coefficients to zero), Elastic Net, and tree importance scores."},
    {"type": "bullet", "text": "<b>Hybrid Methods:</b> Combine filter pre-screening to eliminate non-informative variables followed by wrapper optimization on the reduced subset."},

    {"type": "h1", "text": "4. Stepwise Regression & Model Evaluation Criteria"},
    {"type": "p", "text": "Stepwise regression iteratively modifies feature subsets using three strategies: <b>Forward Selection</b> (starts with zero features, adds best predictor step-by-step), <b>Backward Elimination</b> (starts with all features, prunes least significant predictors), and <b>Bidirectional Selection</b> (evaluates additions and deletions at each iteration)."},
    {"type": "h2", "text": "Key Statistical Model Selection Criteria:"},
    {"type": "bullet", "text": "<b>R² (Coefficient of Determination):</b> Proportion of variance in the dependent variable explained by predictors."},
    {"type": "bullet", "text": "<b>Adjusted R²:</b> Penalizes excessive non-informative parameters: 1 - [(1 - R²)(N - 1) / (N - p - 1)]."},
    {"type": "bullet", "text": "<b>P-values:</b> Significance testing for regression coefficients (features with p &lt; 0.05 retained)."},
    {"type": "bullet", "text": "<b>AIC (Akaike Information Criterion):</b> Balances goodness-of-fit against model complexity (lower score preferred)."},
    {"type": "bullet", "text": "<b>BIC (Bayesian Information Criterion):</b> Similar to AIC with a heavier penalty for large sample sizes."},
    {"type": "bullet", "text": "<b>K-Fold Cross-Validation:</b> Validates generalization error across independent data partitions."},

    {"type": "h1", "text": "5. Entropy & Information Theory in Machine Learning"},
    {"type": "p", "text": "<b>Entropy H(X)</b> measures the impurity, randomness, or uncertainty in a dataset. For a binary distribution with probability p:"},
    {"type": "code", "text": "H(X) = - [ p · log₂(p) + (1 - p) · log₂(1 - p) ]"},
    {"type": "bullet", "text": "<b>Zero Entropy (0 bits):</b> Absolute certainty; all instances belong to a single class."},
    {"type": "bullet", "text": "<b>Maximum Entropy (1.0 bit):</b> Complete uncertainty; classes are split 50/50 (highest impurity)."},
    {"type": "bullet", "text": "<b>Information Gain:</b> The reduction in entropy achieved by partitioning a dataset on a given feature: Gain(S, A) = H(S) - Σ [ (|Sᵥ| / |S|) · H(Sᵥ) ]."},

    {"type": "h1", "text": "6. Decision Tree Algorithms"},
    {"type": "p", "text": "Decision trees recursively partition data based on attribute splits that maximize Information Gain or minimize Gini Impurity."},
    {"type": "bullet", "text": "<b>Root Node:</b> Top-level split on the single most informative feature."},
    {"type": "bullet", "text": "<b>Internal Nodes:</b> Decision boundaries evaluating attribute thresholds."},
    {"type": "bullet", "text": "<b>Leaf Nodes:</b> Terminal nodes outputting predicted classification labels or continuous regression values."},
    {"type": "bullet", "text": "<b>Continuous Variable Splitting:</b> Sorts numeric values and tests candidate midpoints to identify the threshold maximizing information gain."},

    {"type": "h1", "text": "7. Random Forests (Bootstrap Aggregating / Bagging)"},
    {"type": "p", "text": "Random Forest is an ensemble learning method that trains hundreds of unpruned decision trees on randomized bootstrap samples of data."},
    {"type": "bullet", "text": "<b>Bootstrap Sampling:</b> Each tree trains on an independent sample drawn with replacement (~80% of training data)."},
    {"type": "bullet", "text": "<b>Random Feature Subsets:</b> At every node split, only a random subset F of the total features is evaluated (typically F = √Total for classification)."},
    {"type": "bullet", "text": "<b>Ensemble Voting:</b> Combines predictions via majority voting (classification) or averaging (regression), drastically reducing variance and preventing overfitting."},

    {"type": "h1", "text": "8. Matrix Decomposition: SVD & PCA"},
    {"type": "h2", "text": "Singular Value Decomposition (SVD):"},
    {"type": "p", "text": "Decomposes any m × n matrix X of rank k into three constituent matrices:"},
    {"type": "code", "text": "X = U · S · Vᵀ\n\nWhere:\n• U is an m × k orthogonal matrix (left singular vectors)\n• S is a k × k diagonal matrix of non-negative singular values (σ₁ ≥ σ₂ ≥ ... ≥ σₖ)\n• V is a k × n orthogonal matrix (right singular vectors)"},
    {"type": "p", "text": "Low-rank approximation keeps the top d singular values, enabling data compression, noise filtering, and latent semantic analysis."},
    {"type": "h2", "text": "Principal Component Analysis (PCA):"},
    {"type": "p", "text": "An unsupervised linear transformation that projects high-dimensional data onto orthogonal axes (principal components) maximizing explained variance. Decorrelates features, eliminates multicollinearity, and compresses feature spaces."}
]

# =========================================================================
# MODULE 3
# =========================================================================
mod3_sections = [
    {"type": "h1", "text": "1. Plotting and Visualization Overview"},
    {"type": "p", "text": "Data visualization translates numerical values into clear graphical representations for exploratory analysis, anomaly detection, and stakeholder communication. In Python, <b>matplotlib</b> (created by John Hunter in 2002) is the foundational 2D visualization library supporting interactive GUI backends, Jupyter Notebook integration, and export to PDF, SVG, PNG, and vector formats."},

    {"type": "h1", "text": "2. Matplotlib API Architecture: Figures & Subplots"},
    {"type": "p", "text": "Every matplotlib plot resides inside a top-level <b>Figure</b> object containing one or more <b>Axes</b> (subplots):"},
    {"type": "code", "text": "import matplotlib.pyplot as plt\nimport numpy as np\n\nfig = plt.figure(figsize=(10, 6))\nax1 = fig.add_subplot(2, 2, 1)  # Top-left in 2x2 grid\nax2 = fig.add_subplot(2, 2, 2)  # Top-right\nax3 = fig.add_subplot(2, 2, 3)  # Bottom-left\n\nax1.hist(np.random.randn(100), bins=20, color='k', alpha=0.3)\nax2.scatter(np.arange(30), np.arange(30) + 3 * np.random.randn(30))\nax3.plot(np.random.randn(50).cumsum(), 'k--')\nplt.subplots_adjust(wspace=0.3, hspace=0.3)\nplt.show()"},

    {"type": "h1", "text": "3. Formatting: Colors, Markers, Line Styles, and Ticks"},
    {"type": "bullet", "text": "<b>Line Styles & Markers:</b> String abbreviations (e.g. <code>'g--'</code> for green dashed, <code>'ko--'</code> for black dashed with circle markers) or explicit keyword arguments (<code>linestyle='--', color='green', marker='o'</code>)."},
    {"type": "bullet", "text": "<b>Axis Ticks & Labels:</b> Customized using <code>ax.set_xticks([0, 250, 500, 750, 1000])</code>, <code>ax.set_xticklabels(['Q1', 'Q2', 'Q3', 'Q4'], rotation=30)</code>, <code>ax.set_xlabel('Timeline')</code>, and <code>ax.set_title('Performance')</code>."},
    {"type": "bullet", "text": "<b>Legends:</b> Generated via <code>ax.legend(loc='best')</code> matching the <code>label</code> parameter of each plotted element."},
    {"type": "bullet", "text": "<b>Annotations & Patches:</b> Shapes from <code>matplotlib.patches</code> (Rectangle, Circle, Polygon) added via <code>ax.add_patch()</code> along with text callouts via <code>ax.text()</code> and <code>ax.annotate()</code>."},

    {"type": "h1", "text": "4. Plotting with pandas and seaborn"},
    {"type": "p", "text": "<b>pandas</b> integrates high-level plotting directly on Series and DataFrame objects. <b>seaborn</b> (developed by Michael Waskom) provides high-level statistical plotting routines with beautiful default palettes."},
    {"type": "h2", "text": "Key Visualization Types in pandas & seaborn:"},
    {"type": "bullet", "text": "<b>Line Plots:</b> <code>df.plot()</code> defaults to plotting each numeric column as a separate line with automatic legends."},
    {"type": "bullet", "text": "<b>Bar Plots:</b> <code>df.plot.bar()</code> (vertical) and <code>df.plot.barh()</code> (horizontal). Use <code>stacked=True</code> for component breakdowns."},
    {"type": "bullet", "text": "<b>Seaborn Statistical Bars:</b> <code>sns.barplot(x='day', y='total_bill', hue='sex', data=tips)</code> with automated bootstrap confidence interval error bars."},
    {"type": "bullet", "text": "<b>Scatter Plots:</b> Display pairwise relationships on Cartesian coordinates to reveal positive, negative, or null correlations."},
    {"type": "bullet", "text": "<b>Facet Grids:</b> <code>sns.FacetGrid(df, col='time', row='smoker').map(plt.hist, 'tip')</code> to generate multi-panel visualizations across categorical dimensions."},

    {"type": "h1", "text": "5. Specialized Statistical Visualizations"},
    {"type": "table", "data": [
        ["Plot Type", "Best Use Case", "Python Implementation"],
        ["Histogram & KDE", "Univariate distribution & probability density", "plt.hist(data) / sns.kdeplot(data)"],
        ["Box & Whisker Plot", "Five-number summary (min, Q1, median, Q3, max, outliers)", "sns.boxplot(x='category', y='value')"],
        ["Violin Plot", "Combines box plot summary with kernel density shape", "sns.violinplot(x='category', y='value')"],
        ["Swarm / Strip Plot", "Displays raw observations without categorical point overlap", "sns.swarmplot(x='category', y='value')"],
        ["Heatmap", "Correlation matrices and 2D tabular intensity grids", "sns.heatmap(df.corr(), annot=True, cmap='coolwarm')"],
        ["Pair Plot", "Pairwise bivariate scatter plots across all numeric features", "sns.pairplot(df, hue='target')"]
    ], "colWidths": [120, 240, 180]}
]

# =========================================================================
# MODULE 4
# =========================================================================
mod4_sections = [
    {"type": "h1", "text": "1. Distributions & Histogram Representations"},
    {"type": "p", "text": "A <b>histogram</b> summarizes continuous data by dividing numeric ranges into discrete bins (compartments) and displaying the frequency or proportion of observations falling into each bin. Histograms are foundational for observing distribution shape, central tendency, spread, skewness, and outliers."},
    {"type": "code", "text": "import matplotlib.pyplot as plt\nimport numpy as np\n\ndata = np.random.normal(loc=0, scale=1, size=1000)\nplt.hist(data, bins=30, color='skyblue', edgecolor='black')\nplt.xlabel('Values')\nplt.ylabel('Frequency')\nplt.title('Histogram of Standard Normal Data')\nplt.show()"},

    {"type": "h1", "text": "2. Outlier Detection and Mitigation"},
    {"type": "p", "text": "Outliers are observations that deviate substantially from the overall distribution pattern. Unchecked outliers distort mean and variance estimates and compromise hypothesis test validity."},
    {"type": "bullet", "text": "<b>Sorting & Truncation:</b> Inspecting extreme percentiles to identify recording anomalies."},
    {"type": "bullet", "text": "<b>Z-Score Method:</b> Flagging points where |z| &gt; 3, where z = (x - μ) / σ."},
    {"type": "bullet", "text": "<b>IQR (Interquartile Range) Method:</b> Mild outliers lie outside [Q1 - 1.5·IQR, Q3 + 1.5·IQR]; extreme outliers lie outside [Q1 - 3·IQR, Q3 + 3·IQR]."},

    {"type": "h1", "text": "3. Probability Mass Functions (PMF) vs. Cumulative Distribution Functions (CDF)"},
    {"type": "h2", "text": "Probability Mass Function (PMF):"},
    {"type": "p", "text": "Maps discrete values to their occurrence probabilities: P(X = x). Constructed by normalizing frequency counts by total sample size n. As sample size grows or with continuous data, raw PMFs suffer from noise and small-bin probability dispersion."},
    {"type": "h2", "text": "Cumulative Distribution Function (CDF):"},
    {"type": "p", "text": "Computes the cumulative probability that variable X takes a value less than or equal to x: F(x) = P(X ≤ x). Smooth, monotonically increasing from 0 to 1, and immune to binning artifacts."},

    {"type": "h1", "text": "4. The Class Size Paradox"},
    {"type": "p", "text": "The <b>Class Size Paradox</b> illustrates sampling bias in survey data: the average class size experienced by individual students is systematically higher than the actual average class size computed across all classes."},
    {"type": "p", "text": "<b>Example:</b> Consider a school with 3 classes of sizes 10, 20, and 30 students. The unweighted average class size is (10 + 20 + 30) / 3 = <b>20 students</b>. However, when surveyed by student, 10 students report size 10, 20 report size 20, and 30 report size 30. The student-weighted average is [ (10×10) + (20×20) + (30×30) ] / 60 = 1400 / 60 ≈ <b>23.33 students</b>."},

    {"type": "h1", "text": "5. DataFrame Indexing in pandas"},
    {"type": "bullet", "text": "<b>Label-Based Indexing (.loc):</b> Selects rows and columns by explicit label: <code>df.loc['row_label', 'col_label']</code>."},
    {"type": "bullet", "text": "<b>Integer-Based Indexing (.iloc):</b> Selects elements by 0-based integer position: <code>df.iloc[0:5, 1:3]</code>."},
    {"type": "bullet", "text": "<b>Boolean Filtering:</b> Extracts subsets satisfying logical criteria: <code>df[df['age'] &gt; 25]</code>."},
    {"type": "bullet", "text": "<b>Setting Indexes:</b> <code>df.set_index('ID', inplace=True)</code> transforms columns into primary lookup keys."},

    {"type": "h1", "text": "6. Parametric Continuous Distributions in Python"},
    {"type": "h2", "text": "A) Normal (Gaussian) Distribution:"},
    {"type": "p", "text": "Symmetric, bell-shaped distribution centered at mean μ with spread σ. Follows the Empirical Rule: 68% of data falls within 1σ, 95% within 2σ, and 99.7% within 3σ."},
    {"type": "code", "text": "from scipy.stats import norm\nimport numpy as np\n\ndata = np.random.normal(loc=50, scale=10, size=1000)\nx = np.linspace(20, 80, 500)\npdf = norm.pdf(x, loc=50, scale=10)"},
    {"type": "h2", "text": "B) Exponential Distribution:"},
    {"type": "p", "text": "Models time elapsed between independent Poisson events occurring at constant rate λ. Highly right-skewed and uniquely <i>memoryless</i>: P(X &gt; s + t | X &gt; s) = P(X &gt; t)."},
    {"type": "h2", "text": "C) Lognormal Distribution:"},
    {"type": "p", "text": "Continuous distribution of a positive random variable whose natural logarithm is normally distributed. Frequently models wealth, income, stock prices, and server response times."}
]

# =========================================================================
# MODULE 5
# =========================================================================
mod5_sections = [
    {"type": "h1", "text": "1. Time Series Analysis Fundamentals"},
    {"type": "p", "text": "<b>Time Series Analysis</b> inspects sequentially ordered observations recorded at regular discrete intervals (hourly, daily, monthly, annual). Essential for revenue forecasting, stock pricing, anomaly monitoring, and capacity planning."},
    {"type": "h2", "text": "Core Components of Time Series Decomposition:"},
    {"type": "bullet", "text": "<b>Trend (T):</b> Long-term persistent upward, downward, or stationary trajectory over extended time horizons."},
    {"type": "bullet", "text": "<b>Seasonality (S):</b> Predictable, repeating cyclical fluctuations linked to calendar periods (day of week, month, holidays)."},
    {"type": "bullet", "text": "<b>Cyclical Variations (C):</b> Multi-year macroeconomic wave fluctuations without fixed calendar periodicity."},
    {"type": "bullet", "text": "<b>Irregularity / Noise (I):</b> Random, unpredictable residual shocks and anomalies remaining after decomposing T, S, and C."},

    {"type": "h1", "text": "2. Time Series Forecasting Algorithms"},
    {"type": "bullet", "text": "<b>Autoregressive (AR(p)):</b> Models values as linear combinations of their own past p lagged observations."},
    {"type": "bullet", "text": "<b>ARIMA(p, d, q):</b> Combines Autoregression (p), Differencing (d) to enforce stationarity, and Moving Average errors (q)."},
    {"type": "bullet", "text": "<b>SARIMA(p, d, q)(P, D, Q)s:</b> Extends ARIMA with multiplicative seasonal terms for periodic data."},
    {"type": "bullet", "text": "<b>Vector Autoregression (VAR):</b> Models multivariate time series capturing bidirectional feedback between simultaneous series."},
    {"type": "bullet", "text": "<b>Exponential Smoothing (SES / Holt-Winters):</b> Assigns exponentially decreasing weights to older observations while capturing level, trend, and seasonal components."},
    {"type": "bullet", "text": "<b>Deep Learning (LSTM & GRU):</b> Recurrent architectures preserving long-term temporal dependencies in complex nonlinear sequences."},

    {"type": "h1", "text": "3. Moving Averages & Smoothing Techniques"},
    {"type": "bullet", "text": "<b>Simple Moving Average (SMA):</b> Unweighted arithmetic mean over rolling window w: <code>df['SMA'] = df['Val'].rolling(window=3).mean()</code>."},
    {"type": "bullet", "text": "<b>Exponential Moving Average (EMA):</b> Assigns higher weighting to recent prices with smoothing factor α = 2 / (span + 1): <code>df['EMA'] = df['Val'].ewm(span=3).mean()</code>."},
    {"type": "bullet", "text": "<b>Serial Correlation & Autocorrelation:</b> Measures linear correlation between a time series and its own lagged values (lag 1, lag 2, ...), visualized using Autocorrelation Function (ACF) correlograms."},

    {"type": "h1", "text": "4. Missing Value Imputation in Time Series"},
    {"type": "bullet", "text": "<b>Forward Fill (ffill):</b> Propagates the last valid observation forward: <code>df.fillna(method='ffill')</code>."},
    {"type": "bullet", "text": "<b>Backward Fill (bfill):</b> Back-propagates the next valid observation backward: <code>df.fillna(method='bfill')</code>."},
    {"type": "bullet", "text": "<b>Linear Interpolation:</b> Connects gap endpoints linearly across timestamps: <code>df.interpolate(method='linear')</code>."},

    {"type": "h1", "text": "5. Predictive Model Evaluation Metrics"},
    {"type": "p", "text": "Model assessment verifies generalization capability and prevents overfitting across classification and regression tasks:"},
    {"type": "h2", "text": "Classification Metrics (Confusion Matrix):"},
    {"type": "table", "data": [
        ["Metric", "Formula", "Definition & Significance"],
        ["Accuracy", "(TP + TN) / (TP + TN + FP + FN)", "Overall correctness (can be misleading in imbalanced datasets)"],
        ["Precision", "TP / (TP + FP)", "Exactness: percentage of predicted positives that are true positives"],
        ["Recall (Sensitivity)", "TP / (TP + FN)", "Completeness: percentage of actual positives correctly identified"],
        ["F1-Score", "2 · (Precision · Recall) / (Precision + Recall)", "Harmonic mean providing balanced precision-recall trade-off"],
        ["ROC-AUC", "Area Under Receiver Operating Characteristic", "Evaluates class separation across varying decision thresholds"]
    ], "colWidths": [100, 180, 260]},
    {"type": "h2", "text": "Regression Metrics:"},
    {"type": "bullet", "text": "<b>Mean Absolute Error (MAE):</b> (1/N) · Σ |yᵢ - ŷᵢ| — average absolute error in original units."},
    {"type": "bullet", "text": "<b>Mean Squared Error (MSE):</b> (1/N) · Σ (yᵢ - ŷᵢ)² — heavily penalizes large outlier errors."},
    {"type": "bullet", "text": "<b>Root Mean Squared Error (RMSE):</b> √MSE — standard deviation of prediction residuals."}
]

def main():
    print("Building official curriculum module PDFs...")
    build_pdf(
        os.path.join(OUT_DIR, "module-1.pdf"),
        "Module 1: Introduction to Data Science",
        "Subject: Data Science (22DS102006) · Specialization Elective",
        mod1_sections
    )
    build_pdf(
        os.path.join(OUT_DIR, "module-2.pdf"),
        "Module 2: Data Extraction & Feature Selection",
        "Subject: Data Science (22DS102006) · Specialization Elective",
        mod2_sections
    )
    build_pdf(
        os.path.join(OUT_DIR, "module-3.pdf"),
        "Module 3: Plotting and Visualization",
        "Subject: Data Science (22DS102006) · Specialization Elective",
        mod3_sections
    )
    build_pdf(
        os.path.join(OUT_DIR, "module-4.pdf"),
        "Module 4: Statistical Thinking & Distributions",
        "Subject: Data Science (22DS102006) · Specialization Elective",
        mod4_sections
    )
    build_pdf(
        os.path.join(OUT_DIR, "module-5.pdf"),
        "Module 5: Time Series Analysis & Predictive Modeling",
        "Subject: Data Science (22DS102006) · Specialization Elective",
        mod5_sections
    )
    print("All 5 module PDFs generated successfully!")

if __name__ == "__main__":
    main()
