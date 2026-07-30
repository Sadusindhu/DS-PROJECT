import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df=pd.read_csv("employee_salary_workforce_analytics.csv")
print("="*50)
print("EMPLOYEE SALARY DATASET")
print("="*50)
print(df.head())
print(df.tail())
print("\nDataset shape:")
print(df.shape)

print("\nDataset Information:")
print(df.info())

df["Salary"]=df["Salary"].fillna(df["Salary"].mean())
print("\nMissing Values in Salary column After Inputation:")


df["Department"]=df["Department"].fillna("Unknown")
print("\nMissing Values in Departmnety column After Inputation:")

df=df.drop_duplicates()

print("\nDatset Shape After Removeing Duplication:")

df["Department"]=df["Department"].str.strip()
print("\nUnique Departments in the Dataset")

df["Gender"]=df["Gender"].str.title()
print("\nUnive Gender in the Dataset:")

df.to_csv("Output/cleaned_employee_salary_work_analytics.csv",index=False)

# Data exploratory analysis(EDA)

print("Total number of employee:",len(df))
# Average salary
print("Average salary:",df["Salary"].mean())

# Highest salary

print("Highest salary:",df["Salary"].max())

#Lowest salary

print("Loest salary:",df["Salary"].min())

# Calculate median salary

print("Median salary:",df["Salary"].median())

# Calculate salary standard deviation
print("Salary standard deviation:",df["Salary"].std())

# Average of the employee age
print("Average employee age:",df["Age"].mean())

# count employees departmentswise
print(df["Department"].value_counts())

#count employee city-wise
print(df["City"].value_counts())

# count male & female employee
print(df["Gender"].value_counts())

department_salary=df.groupby("Department")["Salary"].mean()
print(department_salary.sort_values(ascending=False))

print(department_salary.idxmax())
print(department_salary.max())

# top 10 higest paid employees

top_10=df.sort_values(by="Salary",ascending=False)
print(top_10.head(10))

# remote worker
remote=df[df["Work_Mode"]=="Remote"]
print(remote)


# performance > 8
performance = df[df["Performance_Score"] > 8]
print(performance)

bonus=df.groupby("Department")["Bonus"].mean()
print(bonus)

satisfaction = df.groupby("Department")["Job_Satisfaction"].mean()
print(satisfaction)

project = df[df["Projects_Completed"] > 5]
print(project)

training = df[df["Training_Hours"] > 10]
print(training)


department_count=df.groupby("Department").size()
print(department_count)

# Data Visualization

# ==========================================================
# 1. GENDER DISTRIBUTION - PIE CHART
# ==========================================================

plt.figure(figsize=(7, 7))

gender_count = df["Gender"].value_counts()

plt.pie(
    gender_count.values,
    labels=gender_count.index,
    autopct="%1.1f%%",
    startangle=90
)

plt.title("Gender Distribution")
plt.tight_layout()
plt.show()


# ==========================================================
# 2. DEPARTMENT-WISE EMPLOYEE COUNT - BAR CHART
# ==========================================================

plt.figure(figsize=(8, 5))

department_count = df["Department"].value_counts()

plt.bar(
    department_count.index,
    department_count.values
)

plt.title("Department-wise Employee Count")
plt.xlabel("Department")
plt.ylabel("Number of Employees")

plt.xticks(rotation=45)
plt.tight_layout()
plt.show()


# ==========================================================
# 3. SALARY DISTRIBUTION - HISTOGRAM
# ==========================================================

plt.figure(figsize=(8, 5))

plt.hist(
    df["Salary"],
    bins=20,
    edgecolor="black"
)

plt.title("Salary Distribution")
plt.xlabel("Salary")
plt.ylabel("Number of Employees")

plt.tight_layout()
plt.show()


# ==========================================================
# 4. SALARY VS EXPERIENCE - SCATTER PLOT
# ==========================================================

plt.figure(figsize=(8, 5))

sns.scatterplot(
    data=df,
    x="Experience",
    y="Salary"
)

plt.title("Salary vs Experience")
plt.xlabel("Experience")
plt.ylabel("Salary")

plt.tight_layout()
plt.show()


# ==========================================================
# 5. AVERAGE SALARY BY DEPARTMENT - BAR PLOT
# ==========================================================

plt.figure(figsize=(8, 5))

department_salary = (
    df.groupby("Department")["Salary"]
    .mean()
    .sort_values(ascending=False)
)

sns.barplot(
    x=department_salary.values,
    y=department_salary.index
)

plt.title("Average Salary by Department")
plt.xlabel("Average Salary")
plt.ylabel("Department")

plt.tight_layout()
plt.show()


# ==========================================================
# 6. JOB SATISFACTION DISTRIBUTION - BOX PLOT
# ==========================================================

plt.figure(figsize=(7, 5))

sns.boxplot(
    y=df["Job_Satisfaction"]
)

plt.title("Job Satisfaction Distribution")
plt.ylabel("Job Satisfaction")

plt.tight_layout()
plt.show()


# ==========================================================
# 7. PERFORMANCE SCORE DISTRIBUTION - HISTOGRAM
# ==========================================================

plt.figure(figsize=(8, 5))

plt.hist(
    df["Performance_Score"],
    bins=10,
    edgecolor="black"
)

plt.title("Performance Score Distribution")
plt.xlabel("Performance Score")
plt.ylabel("Number of Employees")

plt.tight_layout()
plt.show()


# ==========================================================
# 8. WORK MODE DISTRIBUTION - COUNT PLOT
# ==========================================================

plt.figure(figsize=(7, 5))

sns.countplot(
    data=df,
    x="Work_Mode"
)

plt.title("Work Mode Distribution")
plt.xlabel("Work Mode")
plt.ylabel("Number of Employees")

plt.tight_layout()
plt.show()


# ==========================================================
# 9. CORRELATION HEATMAP
# ==========================================================

plt.figure(figsize=(10, 7))

# Select only numerical columns
numeric_df = df.select_dtypes(include=np.number)

# Calculate correlation
correlation = numeric_df.corr()

sns.heatmap(
    correlation,
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)

plt.title("Correlation Heatmap")
plt.tight_layout()
plt.show()


# ==========================================================
# 10. TOP 10 HIGHEST SALARIES - HORIZONTAL BAR CHART
# ==========================================================

plt.figure(figsize=(8, 6))

top_10 = df.sort_values(
    by="Salary",
    ascending=False
).head(10)

plt.barh(
    top_10["Name"],
    top_10["Salary"]
)

plt.title("Top 10 Highest Salaries")
plt.xlabel("Salary")
plt.ylabel("Employee Name")

# Display highest salary at the top
plt.gca().invert_yaxis()

plt.tight_layout()
plt.show()


# ==========================================================
# END OF DATA VISUALIZATION
# ==========================================================

print("=" * 60)
print("ALL 10 VISUALIZATIONS COMPLETED SUCCESSFULLY")
print("=" * 60)