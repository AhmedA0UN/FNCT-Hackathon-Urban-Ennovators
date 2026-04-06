# Simple AI Model - House Price Prediction

This project demonstrates how to build and train simple machine learning models using scikit-learn.

## What This Does

The project trains two different models to predict house prices based on house size:
- **Linear Regression**: A simple, interpretable model
- **Random Forest**: A more complex ensemble model

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

## Installation

1. **Create a virtual environment** (recommended):
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. **Install dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

   Or install packages individually:
   ```powershell
   pip install numpy pandas matplotlib scikit-learn
   ```

## Running the Model

Execute the main script:
```powershell
python simple_model.py
```

## What Happens

1. **Data Preparation**: Loads sample training data (house sizes and prices)
2. **Model 1 - Linear Regression**: Trains a simple linear model
3. **Model 2 - Random Forest**: Trains an ensemble model with multiple decision trees
4. **Evaluation**: Compares both models using MSE, MAE, and R² metrics
5. **Prediction**: Makes price predictions for new house sizes
6. **Visualization**: Creates a comparison plot of both models
7. **Persistence**: Saves trained models as `.pkl` files

## Output Files

- `model_comparison.png` - Side-by-side visualization of both models
- `linear_model.pkl` - Saved Linear Regression model
- `random_forest_model.pkl` - Saved Random Forest model

## Model Metrics Explained

- **MSE (Mean Squared Error)**: Average of squared differences between actual and predicted values
- **MAE (Mean Absolute Error)**: Average absolute difference between actual and predicted values
- **R² Score**: Proportion of variance explained by the model (1.0 = perfect, 0.0 = poor)

## Next Steps

- **Use Real Data**: Replace sample data with a real dataset from Kaggle
- **Feature Engineering**: Add more features (number of rooms, age, location)
- **Hyperparameter Tuning**: Optimize model parameters with GridSearchCV
- **Cross-Validation**: Use k-fold cross-validation for better evaluation
- **Try Different Models**: Experiment with Gradient Boosting, SVMs, or Neural Networks

## Loading and Using Saved Models

```python
import joblib

# Load a saved model
model = joblib.load('linear_model.pkl')

# Make predictions
new_data = [[1500], [2500]]  # House sizes
predictions = model.predict(new_data)
print(predictions)  # Output: prices
```

## Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'sklearn'`
**Solution**: Install scikit-learn with `pip install scikit-learn`

**Issue**: Files not found when running the script
**Solution**: Make sure you're in the correct directory with `cd` before running

**Issue**: Permission errors
**Solution**: Run PowerShell as Administrator or use a virtual environment

## Resources

- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Machine Learning Basics](https://developers.google.com/machine-learning/crash-course)
- [Kaggle Datasets](https://www.kaggle.com/datasets)
