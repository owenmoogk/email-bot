stringTemplate = "hi my name is {NAME} and my age is {AGE}"

dictionary = {
    'NAME': 'owen',
    'AGE': '15'
}

indexes = []
for i in range(0, len(stringTemplate)):
    if stringTemplate[i] == '{':
        initial = i
        while stringTemplate[i] != '}':
            i += 1
        final = i
        indexes.append((initial, final))

variables = []
for index in indexes:
    variables.append(stringTemplate[index[0]+1:index[1]])

for variable in variables:
    stringTemplate = stringTemplate.replace("{"+variable+"}", dictionary[variable])

print(stringTemplate)