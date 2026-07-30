import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load Dataset (Handles Encoding Errors)

file_name = "netflix_titles.csv"
encodings = ["utf-8", "utf-8-sig", "latin1", "cp1252"]
df = None

for enc in encodings:
    try:
        df = pd.read_csv(file_name, encoding=enc)
        print(f"\nDataset loaded successfully using '{enc}' encoding.\n")
        break
    except UnicodeDecodeError:
        print(f"Failed with encoding: {enc}")
    except FileNotFoundError:
        print(f"Error: '{file_name}' not found.")
        exit()

if df is None:
    print("Could not read the dataset. Please check the file.")
    exit()

# Display Dataset

print("First 10 Records")
print(df.head(10))

print("\nShape")
print(df.shape)

print("\nColumns")
print(df.columns)

print("\nData Types")
print(df.dtypes)

print("\nMissing Values")
print(df.isnull().sum())


# Remove Duplicates
df.drop_duplicates(inplace=True)

# Rename Columns
df.columns = df.columns.str.lower().str.replace(" ", "_")

# Fill Missing Values
if "director" in df.columns:
    df["director"] = df["director"].fillna("Unknown")
if "country" in df.columns:
    df["country"] = df["country"].fillna("Unknown")

# Convert Date

if "date_added" in df.columns:
    df["date_added"] = pd.to_datetime(df["date_added"], errors="coerce")
    df["year_added"] = df["date_added"].dt.year
    df["month_added"] = df["date_added"].dt.month_name()

# Save Cleaned Dataset
df.to_csv("cleaned_netflix_data.csv", index=False)
print("\nCleaned dataset saved as 'cleaned_netflix_data.csv'")
print("\nProject Part-1 Completed Successfully!")

# PART 2 : EXPLORATORY DATA ANALYSIS


print("\n" + "="*60)
print("PART 2 : EXPLORATORY DATA ANALYSIS")
print("="*60)

# 11. Find the total number of Netflix titles.
print("\n11. Total Netflix Titles")
print(df.shape[0])

# 12. Count the total number of Movies and TV Shows.
print("\n12. Movies and TV Shows Count")
print(df["type"].value_counts())

# 13. Find the oldest and newest release year.
print("\n13. Oldest and Newest Release Year")
print("Oldest Year :", df["release_year"].min())
print("Newest Year :", df["release_year"].max())

# 14. Find the average release year.
print("\n14. Average Release Year")
print(round(df["release_year"].mean(),2))

# 15. Count content by rating.
print("\n15. Rating Count")
print(df["rating"].value_counts())

# 16. Top 10 Genres
print("\n16. Top 10 Genres")

genre = df["listed_in"].str.split(", ").explode()
print(genre.value_counts().head(10))

# 17. Top 10 Countries
print("\n17. Top 10 Countries")

country = df["country"].str.split(", ").explode()
print(country.value_counts().head(10))

# 18. Top 10 Directors
print("\n18. Top 10 Directors")
print(df["director"].value_counts().head(10))

# 19. Year with Highest Releases
print("\n19. Year with Highest Releases")
print(df["release_year"].value_counts().head(1))

# 20. Month with Highest Content Added
print("\n20. Month with Highest Content Added")
print(df["month_added"].value_counts().head(1))

# 21. Movies Released After 2020
print("\n21. Movies Released After 2020")

movies = df[(df["type"]=="Movie") & (df["release_year"]>2020)]
print(movies[["title","release_year"]])

# 22. TV Shows with More Than 3 Seasons
print("\n22. TV Shows with More Than 3 Seasons")
tv = df[df["type"]=="TV Show"].copy()
tv["duration"] = tv["duration"].str.extract("(\d+)").astype(float)
print(tv[tv["duration"]>3][["title","duration"]])

# 23. Content Released in India
print("\n23. Content Released in India")
india = df[df["country"].str.contains("India",case=False,na=False)]
print(india[["title","country"]])

# 24. Content by Specific Director
print("\n24. Content by Specific Director")
director = input("Enter Director Name : ")
director_data = df[df["director"].str.contains(director,case=False,na=False)]
print(director_data[["title","director"]])

# 25. Titles Containing Love
print("\n25. Titles Containing 'Love'")
love = df[df["title"].str.contains("Love",case=False,na=False)]
print(love[["title"]])

# 26. Movies and TV Shows Year-wise
print("\n26. Movies and TV Shows Year-wise")
print(pd.crosstab(df["release_year"],df["type"]))

# 27. Most Common Content Rating
print("\n27. Most Common Rating")
print(df["rating"].mode()[0])

# 28. Longest Movie
print("\n28. Longest Movie")
movie = df[df["type"]=="Movie"].copy()
movie["duration"] = movie["duration"].str.extract("(\d+)").astype(float)
print(movie.loc[movie["duration"].idxmax()][["title","duration"]])

# 29. Shortest Movie
print("\n29. Shortest Movie")
print(movie.loc[movie["duration"].idxmin()][["title","duration"]])

# 30. Latest 10 Releases
print("\n30. Latest 10 Releases")
print(df.sort_values("release_year",ascending=False)[["title","release_year"]].head(10))

# 31. Oldest 10 Titles
print("\n31. Oldest 10 Titles")
print(df.sort_values("release_year")[["title","release_year"]].head(10))

# 32. Genre-wise Content Count
print("\n32. Genre-wise Content Count")
print(genre.value_counts())

# 33. Country-wise Average Release Year
print("\n33. Country-wise Average Release Year")
country_avg = df.copy()
country_avg = country_avg.assign(country=country_avg["country"].str.split(", "))
country_avg = country_avg.explode("country")
print(country_avg.groupby("country")["release_year"].mean().round(2))

# 34. Number of Unique Directors
print("\n34. Number of Unique Directors")
print(df["director"].nunique())

# 35. Number of Unique Genres
print("\n35. Number of Unique Genres")
print(genre.nunique())


# PART 3 : DATA VISUALIZATION

import os
# Create folders if they don't exist
os.makedirs("charts", exist_ok=True)

# 36. Pie Chart - Movies vs TV Shows
plt.figure(figsize=(6,6))
df["type"].value_counts().plot(
    kind="pie",
    autopct="%1.1f%%",
    startangle=90
)
plt.title("Movies vs TV Shows")
plt.ylabel("")
plt.savefig("charts/movie_vs_tvshow.png")
plt.show()

# 37. Bar Chart - Top 10 Genres

plt.figure(figsize=(10,6))
genre.value_counts().head(10).plot(kind="bar")
plt.title("Top 10 Genres")
plt.xlabel("Genre")
plt.ylabel("Count")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("charts/top_genres.png")
plt.show()

# 38. Bar Chart - Top 10 Countries
plt.figure(figsize=(10,6))
country.value_counts().head(10).plot(kind="bar", color="orange")
plt.title("Top 10 Countries")
plt.xlabel("Country")
plt.ylabel("Count")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("charts/top_countries.png")
plt.show()

# 39. Histogram - Release Year

plt.figure(figsize=(10,6))
plt.hist(df["release_year"], bins=20)
plt.title("Release Year Distribution")
plt.xlabel("Release Year")
plt.ylabel("Frequency")
plt.savefig("charts/release_year_histogram.png")
plt.show()

# 40. Count Plot - Ratings

plt.figure(figsize=(12,6))
sns.countplot(data=df, x="rating", order=df["rating"].value_counts().index)
plt.title("Ratings Distribution")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("charts/ratings_distribution.png")
plt.show()

# 41. Horizontal Bar Chart - Top Directors

plt.figure(figsize=(10,6))
df["director"].value_counts().head(10).sort_values().plot(kind="barh", color="green")
plt.title("Top 10 Directors")
plt.xlabel("Number of Titles")
plt.tight_layout()
plt.savefig("charts/top_directors.png")
plt.show()

# 42. Line Chart - Releases by Year

release = df["release_year"].value_counts().sort_index()
plt.figure(figsize=(12,6))
plt.plot(release.index, release.values, marker="o")
plt.title("Netflix Releases by Year")
plt.xlabel("Year")
plt.ylabel("Number of Releases")
plt.grid(True)
plt.savefig("charts/releases_by_year.png")
plt.show()

# 43. Box Plot - Movie Duration

movie_duration = df[df["type"]=="Movie"].copy()
movie_duration["duration"] = movie_duration["duration"].str.extract("(\d+)").astype(float)
plt.figure(figsize=(6,6))
sns.boxplot(y=movie_duration["duration"])
plt.title("Movie Duration")
plt.savefig("charts/duration_boxplot.png")
plt.show()

# 44. Heatmap

heat = df.copy()
heat["duration_num"] = heat["duration"].str.extract("(\d+)").astype(float)
numeric = heat[["release_year","year_added","duration_num"]]
plt.figure(figsize=(8,6))
sns.heatmap(numeric.corr(), annot=True, cmap="coolwarm")
plt.title("Correlation Heatmap")
plt.tight_layout()
plt.savefig("charts/heatmap.png")
plt.show()

# 45. Dashboard (6 Charts)

fig = plt.figure(figsize=(18,12))
# Chart 1
plt.subplot(2,3,1)
df["type"].value_counts().plot(kind="pie", autopct="%1.1f%%")
plt.title("Movies vs TV Shows")
plt.ylabel("")

# Chart 2
plt.subplot(2,3,2)
genre.value_counts().head(10).plot(kind="bar")
plt.title("Top Genres")

# Chart 3
plt.subplot(2,3,3)
country.value_counts().head(10).plot(kind="bar", color="orange")
plt.title("Top Countries")

# Chart 4
plt.subplot(2,3,4)
plt.hist(df["release_year"], bins=20)
plt.title("Release Year")

# Chart 5
plt.subplot(2,3,5)
sns.countplot(data=df, x="rating", order=df["rating"].value_counts().index)
plt.xticks(rotation=90)
plt.title("Ratings")

# Chart 6
plt.subplot(2,3,6)
plt.plot(release.index, release.values)
plt.title("Releases by Year")

plt.tight_layout()
plt.savefig("charts/dashboard.png")
plt.show()

# PART 4 : BUSINESS INSIGHTS
import os
os.makedirs("output", exist_ok=True)
insights = []
print("\n" + "="*60)
print("PART 4 : BUSINESS INSIGHTS")
print("="*60)

# 46. Which country produces the most Netflix content?
top_country = country.value_counts().idxmax()
top_country_count = country.value_counts().max()
print("\n46. Country Producing Most Netflix Content")
print(top_country, "-", top_country_count)
insights.append(f"1. {top_country} produces the highest Netflix content ({top_country_count} titles).")

# 47. Which genre is the most popular?
top_genre = genre.value_counts().idxmax()
top_genre_count = genre.value_counts().max()
print("\n47. Most Popular Genre")
print(top_genre, "-", top_genre_count)
insights.append(f"2. Most popular genre is {top_genre} ({top_genre_count} titles).")

# 48. Which rating appears most frequently?
top_rating = df["rating"].mode()[0]
print("\n48. Most Common Rating")
print(top_rating)
insights.append(f"3. Most common content rating is {top_rating}.")

# 49. Which year had the highest number of releases?
top_year = df["release_year"].value_counts().idxmax()
top_year_count = df["release_year"].value_counts().max()
print("\n49. Highest Release Year")
print(top_year, "-", top_year_count)
insights.append(f"4. Highest number of releases occurred in {top_year}.")

# 50. Movies or TV Shows?
movie_count = df[df["type"]=="Movie"].shape[0]
tv_count = df[df["type"]=="TV Show"].shape[0]
print("\n50. Netflix Focus")
if movie_count > tv_count:
    print("Netflix focuses more on Movies.")
    insights.append("5. Netflix focuses more on Movies than TV Shows.")
else:
    print("Netflix focuses more on TV Shows.")
    insights.append("5. Netflix focuses more on TV Shows than Movies.")

# 51. Top Director
top_director = df["director"].value_counts().idxmax()
director_titles = df["director"].value_counts().max()
print("\n51. Top Director")
print(top_director, "-", director_titles)
insights.append(f"6. Top contributing director is {top_director}.")

# 52. Percentage of Movies vs TV Shows
movie_percent = round(movie_count/len(df)*100,2)
tv_percent = round(tv_count/len(df)*100,2)
print("\n52. Movies vs TV Shows Percentage")
print("Movies :", movie_percent,"%")
print("TV Shows :", tv_percent,"%")
insights.append(f"7. Movies represent {movie_percent}% of Netflix content.")
insights.append(f"8. TV Shows represent {tv_percent}% of Netflix content.")

# 53. Month with Highest Content Added
top_month = df["month_added"].value_counts().idxmax()
month_count = df["month_added"].value_counts().max()
print("\n53. Month with Highest Content Added")
print(top_month, "-", month_count)
insights.append(f"9. Netflix adds the highest content during {top_month}.")

# 54. Fastest Growing Genre
growth = df.groupby(["release_year","listed_in"]).size().reset_index(name="Count")
fastest = growth.sort_values("Count",ascending=False).iloc[0]
print("\n54. Fastest Growing Genre")
print(fastest["listed_in"])
insights.append(f"10. One of the fastest-growing genres is {fastest['listed_in']}.")

# 55. Display Business Insights
print("\n55. BUSINESS INSIGHTS")
for i in insights:
    print(i)

# Save Insights
with open("output/business_insights.txt","w") as file:
    for i in insights:
        file.write(i+"\n")

# Save Summary CSV
summary = pd.DataFrame({
    "Metric":[
        "Top Country",
        "Top Genre",
        "Top Rating",
        "Top Release Year",
        "Top Director",
        "Movie Percentage",
        "TV Show Percentage",
        "Top Month"
    ],
    "Value":[
        top_country,
        top_genre,
        top_rating,
        top_year,
        top_director,
        movie_percent,
        tv_percent,
        top_month
    ]
})
summary.to_csv("output/analysis_results.csv",index=False)
print("\nBusiness insights saved to output/business_insights.txt")
print("Analysis summary saved to output/analysis_results.csv")
