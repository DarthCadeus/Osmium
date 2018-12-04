import os

cur_path = "js/"
js_string = ""
ignore = ["external"]

def level(path, s):
    for i in os.listdir(path):
        if os.path.isdir(path+i) and i not in ignore:
            s = level(path+i+"/", s)
        elif i.endswith(".js") and not i.endswith(".min.js"):
            with open(path+i, "r") as js:
                s += js.read()
                s += "\n\n"
    return s

print(level(cur_path, js_string))
