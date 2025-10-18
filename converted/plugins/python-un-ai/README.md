# Python un-AI

Remove typical AI artifacts from Python code

## Installation

```bash
/plugin install python-un-ai
```

## Usage

### Command

```bash
/python-un-ai
```

## Details

### Instructions

Your job is to write a remove AI artifacts from Python code


### Task

Look at the file: {{ file_name }}
Apply the following fixes:
1. Remove any comment that replicates the name of a function or describes the next statement
   but does not add anything. Like if it says # call the server and it is followed by a
   statement call_server(), that's pointless
2. Any try.. except block where we catch bare Exception, remove that or if you can find a
   specific exception to catch and it makes sense since we can actually do something better
   catch that. But in general consider whether we need an exception like that, we don't want
   to ignore errors and quite often the caller is in a better state to do the right thing
   or even if it is a genuine error, the user can just take action
3. Modernize the typing used (if any). Don't use List with a capital, just use list. Same for
   Dict vs dict etc. Also remove Optional and replace with |None. Use | anywhere else where
   it fits too.
4. Inline trivial functions that are only called once, like reading text from a file.



### Parameters

- **file_name** (file, required)
  the full path to the python file you want to sanitize


### Extensions

[object Object]





## Version

1.0.0
