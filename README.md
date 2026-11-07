[project_readme.md](project_readme.md)

# 🔱 Sonar Rock vs Mine: From Raw Sonar Signals to a Reliable Classifier

>
> *Developed for DECODEML Hackathon Challenge*

![Python](https://img.shields.io/badge/Python-3.10.11-3776AB?style=flat-square)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4.2-F7931E?style=flat-square)
![Flask](https://img.shields.io/badge/Flask-3.0.3-000000?style=flat-square)
![Dataset](https://img.shields.io/badge/Dataset-UCI%20Sonar-2E8B57?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows%20OS-0078D6?style=flat-square)

## 1. Objective
This project builds a machine learning system that classifies sonar returns as either a Rock (R) or a Mine (M). Sonar echoes from a metal cylinder and a similarly shaped rock differ only subtly, and the signal is noisy and high-dimensional (60 frequency-band features), so manual interpretation needs trained experts and is slow. Our goal is to automate this decision with a model that is accurate, explainable, and reproducible.

The system trains and compares several algorithms on the UCI Sonar dataset, evaluates them on held-out data, and saves the final pipeline. A web interface lets a user enter new readings and get a prediction with a confidence score. Because a missed mine is more dangerous than a false alarm, we also pay particular attention to recall on the Mine class.

## 2. Dataset
- UCI Connectionist Bench (Sonar, Mines vs. Rocks)
- 208 samples (111 Mine, 97 Rock), 60 features (energy per frequency band, 0.0 to 1.0)
- Source: <link to UCI or Kaggle>. No other datasets were used.


## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [How It Works](#-how-it-works)
- [Dataset](#-dataset)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Code Walkthrough](#-code-walkthrough)
- [Results](#-results)
- [Making a Prediction](#-making-a-prediction)
- [Future Improvements](#-future-improvements)
- [Team](#-team)

---

## 🌊 About the Project

Underwater, a **SONAR** (Sound Navigation and Ranging) sends sound waves and listens to the echo that bounces back. Different objects reflect sound differently:

| Object | Echo pattern |
|--------|--------------|
| 🪨 **Rock** | Natural, irregular reflection |
| 💣 **Mine** | Metallic, structured reflection |

**RockVsMine** trains a machine learning model to read these echo patterns and predict whether the object is a **Rock (R)** or a **Mine (M)**.

> 🎯 **Why it matters:** Automatically detecting underwater mines can make naval navigation and demining operations far safer.

---

## ⚙️ How It Works

```
 📥 Sonar Data (CSV)
        │
        ▼
 🧹 Load & Explore with Pandas
        │
        ▼
 ✂️ Split into Features (X) and Label (Y)
        │
        ▼
 🔀 Train / Test Split  (sklearn)
        │
        ▼
 🧠 Train the Model
        │
        ▼
 📊 Check Accuracy  (sklearn)
        │
        ▼
 🔮 Predict: Rock or Mine?
```

---

## 📂 Dataset

- **Source:** Sonar dataset (UCI Machine Learning Repository)
- **Samples:** 208 sonar signals
- **Features:** 60 numbers per sample. Each number is the energy of the echo within a specific frequency band, scaled between 0.0 and 1.0
- **Label (last column):**
  - `R` → Rock
  - `M` → Mine

Each row = one sonar reading of an object.

---

## 🛠️ Tech Stack

| Library | What we use it for |
|---------|--------------------|
| 🔢 **NumPy** | Creating and handling arrays (the input signal for prediction) |
| 🐼 **Pandas** | Loading the CSV and building DataFrames |
| 🤖 **scikit-learn** | `train_test_split` to split the data, `accuracy_score` to measure performance, and the ML model itself |

---

## 🗂️ Project Structure

```
RockVsMine/
│
├── sonar_data.csv        # Dataset
├── rock_vs_mine.py       # Main ML script
├── requirements.txt      # Dependencies
└── README.md             # You are here 🙂
```

---

## 🚀 Getting Started

**1. Install dependencies**
```bash
pip install numpy pandas scikit-learn
```

**2. Run the project**
```bash
python rock_vs_mine.py
```

---

## 🧩 Code Walkthrough

### 1️⃣ Import the libraries
```python
import numpy as np                                   # arrays
import pandas as pd                                  # dataframes
from sklearn.model_selection import train_test_split # split the data
from sklearn.linear_model import LogisticRegression  # the model
from sklearn.metrics import accuracy_score           # measure accuracy
```

### 2️⃣ Load the data into a DataFrame
```python
sonar_data = pd.read_csv('sonar_data.csv', header=None)
print(sonar_data.shape)   # (208, 61)
```

### 3️⃣ Separate features and label
```python
X = sonar_data.drop(columns=60, axis=1)   # 60 sonar readings
Y = sonar_data[60]                        # R or M
```

### 4️⃣ Split into training and test sets
```python
X_train, X_test, Y_train, Y_test = train_test_split(
    X, Y, test_size=0.1, stratify=Y, random_state=1
)
```
- `test_size=0.1` keeps 10% of the data for testing
- `stratify=Y` keeps the Rock/Mine ratio equal in both sets
- `random_state=1` makes results reproducible

### 5️⃣ Train the model
```python
model = LogisticRegression()
model.fit(X_train, Y_train)
```

### 6️⃣ Evaluate with accuracy
```python
train_pred = model.predict(X_train)
print("Training accuracy:", accuracy_score(train_pred, Y_train))

test_pred = model.predict(X_test)
print("Test accuracy:", accuracy_score(test_pred, Y_test))
```

---

## 📊 Results

| Dataset | Accuracy |
|---------|----------|
| 🏋️ Training data | `0.834 %` |
| 🧪 Test data | `0.761 %` |

> Replace the values above with the numbers printed by your script.

---

## 🔮 Making a Prediction

Feed the model a brand-new sonar signal (60 values) using **NumPy**:

```python
input_data = (0.0307, 0.0523, 0.0653, 0.0521, 0.0611, 0.0577, 0.0665, 0.0664, 0.1460,
              0.2792, 0.3877, 0.4992, 0.4981, 0.4972, 0.5607, 0.7339, 0.8230, 0.9173,
              0.9975, 0.9911, 0.8240, 0.6498, 0.5980, 0.4862, 0.3150, 0.1543, 0.0989,
              0.0284, 0.1008, 0.2636, 0.2694, 0.2930, 0.2925, 0.3998, 0.3660, 0.3172,
              0.4609, 0.4374, 0.1820, 0.3376, 0.6202, 0.4448, 0.1863, 0.1420, 0.0589,
              0.0576, 0.0672, 0.0269, 0.0245, 0.0190, 0.0063, 0.0321, 0.0189, 0.0137,
              0.0277, 0.0152, 0.0052, 0.0121, 0.0124, 0.0055)

# list -> NumPy array -> reshape for ONE sample
input_array = np.asarray(input_data)
input_reshaped = input_array.reshape(1, -1)

prediction = model.predict(input_reshaped)

if prediction[0] == 'R':
    print("🪨 The object is a ROCK")
else:
    print("💣 The object is a MINE")
```

---

## 🌱 Future Improvements

- [ ] Compare more models (SVM, Random Forest, KNN)
- [ ] Add confusion matrix and precision/recall
- [ ] Tune hyperparameters with cross-validation
- [ ] Build a simple web app for live predictions
- [ ] Visualise the sonar signals for Rock vs Mine

---

## 👥 Team

| Name | Role | GitHub |
|------|------|--------|
| `SHIVAM KUMAR` | BACKEND | [@officegitshivam](https://github.com/officegitshivam) |
| `RAHUL SINGH` | FRONTEND | [@rahulsingh2008](https://github.com/rahulsingh2008) |

---

<p align="center">
  ⭐ If you found this project helpful, give it a star!<br>
  Made with ❤️ and Python
</p>

---


