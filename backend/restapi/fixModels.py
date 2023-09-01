with open("models.py", "r") as f:
    lines = f.readlines()

models = [line.strip() for line in lines if "class" in line and "(models.Model):" in line]

# Generate a comment
comment = "# MODELS with line numbers\n"
for i, model in enumerate(models):
    line_number = lines.index(model + "\n") + 1  # 1-based indexing
    comment += f"Line {line_number} - {model.split('(')[0].strip()}\n"

print(comment)
