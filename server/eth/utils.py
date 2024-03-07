def is_valid_ethereum_address(address):
    if len(address) != 42:
        return False
    if not address.startswith('0x'):
        return False
    try:
        int(address, 16)
    except ValueError:
        return False
    return True