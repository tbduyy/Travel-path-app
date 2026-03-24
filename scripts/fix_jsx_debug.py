
import os

file_path = r'e:\TP\web-app\app\plan-trip\trips\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Inspecting lines around 670-690
start_line = 665
end_line = 685
print(f"Inspecting lines {start_line} to {end_line}:")
for i in range(start_line, end_line):
    if i < len(lines):
        print(f"{i+1}: {repr(lines[i])}")

# Construct the exact target string to locate
# Based on previous attempts, the pattern is:
# </div>\n
# \n
# \n
# {/* Add Activity Modal */}\n
# <AddActivityModal\n

# Finding the line with "{/* Add Activity Modal */}"
target_idx = -1
for i, line in enumerate(lines):
    if "{/* Add Activity Modal */}" in line:
        target_idx = i
        break

if target_idx != -1:
    print(f"Found target at line {target_idx+1}")
    
    # We want to insert closing divs BEFORE this line (and its preceding empty lines)
    # And one closing div AFTER the modal block.
    
    # Let's count back to find the closing div of the floating bar
    # It should be around target_idx - 3
    
    # We will rewrite the whole block from the floating bar closing div to the end of component return
    
    # The block we replace starts after the `</div>` at line 672 (index 671)
    # verification:
    # 672: </div>
    
    insert_pos = target_idx
    # Check if lines before are empty
    while lines[insert_pos-1].strip() == '':
        insert_pos -= 1
        
    print(f"Insertion point at line {insert_pos+1}")
    
    # The content to insert before the modal
    prefix = "                </div>\n            </div>\n\n"
    
    # The content to insert after the modal
    # We need to find where the modal ends.
    # It ends at line 681 `/>`
    # We look for `/>` after target_idx
    end_modal_idx = -1
    for i in range(target_idx, len(lines)):
        if "/>" in lines[i]:
            end_modal_idx = i
            break
            
    if end_modal_idx != -1:
        print(f"Modal ends at line {end_modal_idx+1}")
        
        # We need to insert `</div>` after `/>`
        # But wait, line 682 is `    );`.
        
        # Let's reconstruct the lines
        
        # New lines for the modal part
        # Keep the modal lines as is?
        # Yes, just wrap them?
        
        # Actually easier to just validly replace the whole chunk:
        # FROM: insert_pos TO end_modal_idx
        
        chunk = lines[insert_pos:end_modal_idx+1]
        
        # We want:
        # prefix
        # chunk
        # suffix ("        </div>\n")
        
        suffix = "        </div>\n"
        
        new_lines = lines[:insert_pos] + [prefix] + lines[target_idx:end_modal_idx+1] + [suffix] + lines[end_modal_idx+1:]
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
        print("File updated successfully.")
        
    else:
        print("Could not find end of modal block")
else:
    print("Could not find target string")
