def soundex(word):
    """
    Implementation of Soundex algorithm for phonetic matching
    Returns a code that represents how the word sounds
    """
    if not word:
        return ""
    
    # Convert to uppercase and get first letter
    word = word.upper()
    first_letter = word[0]
    
    # Remove all occurrences of 'H' and 'W' except first letter
    word = word[1:].replace('H', '').replace('W', '')
    
    # Replace consonants with digits
    replacements = {
        'BFPV': '1',
        'CGJKQSXZ': '2',
        'DT': '3',
        'L': '4',
        'MN': '5',
        'R': '6'
    }
    
    code = first_letter
    for char in word:
        for key in replacements:
            if char in key:
                if len(code) == 0 or code[-1] != replacements[key]:
                    code += replacements[key]
                break
    
    # Pad with zeros or truncate to make it 4 characters
    code = (code + '000')[:4]
    return code