import re

# Read the file
with open(r'e:\TP\web-app\app\plan-trip\trips\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the problematic section
# We know the issue is around lines 672-682
# Need to replace from line 672 onwards with correct structure

# Pattern: find the broken structure
pattern = r'(                    </div>\r?\n)\n\n            {/\* Add Activity Modal \*/}\n            <AddActivityModal\n                isOpen={showAddActivityModal}\n                onClose={\(\) => setShowAddActivityModal\(false\)}\n                onAdd={handleAddActivity}\n                selectedPlaces={selectedPlaces}\n            />\r?\n    \);'

# Replacement with correct structure
replacement = r'''\1                </div>

                {/* Add Activity Modal */}
                <AddActivityModal
                    isOpen={showAddActivityModal}
                    onClose={() => setShowAddActivityModal(false)}
                    onAdd={handleAddActivity}
                    selectedPlaces={selectedPlaces}
                />
            </div>
        </div>
    );'''

# Apply fix
fixed_content = re.sub(pattern, replacement, content)

# Write back
with open(r'e:\TP\web-app\app\plan-trip\trips\page.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(fixed_content)

print("Fixed!")
