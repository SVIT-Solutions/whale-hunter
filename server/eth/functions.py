import requests


# Etherscan API
def fetch_latest_block_number(api_key=None):
    if api_key is None:
        return None

    try:
        url = f'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey={api_key}'

        response = requests.get(url)

        if response.status_code == 200:
            latest_block_number = int(response.json()['result'], 16)
            return latest_block_number
        else:
            return None
    except Exception as e:
        return None


def fetch_wallet_transactions(wallet_address=None, api_key=None, endblock=999999999):
    if wallet_address is None or api_key is None:
        return None, 'Wallet address or API key not provided.'

    url = f'https://api.etherscan.io/api?module=account&action=tokentx&address={wallet_address}&startblock=0&endblock={endblock}&sort=asc&apikey={api_key}'

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if 'result' in data:
                return data['result'], None
            else:
                return None, 'No transaction data found in the response'
        else:
            return None, f'Failed to fetch data from Etherscan API. Status code: {response.status_code}'
    except Exception as e:
        return None, str(e)


def calculate_token_balances(transactions, wallet_address):
    token_balances = {}

    for tx in transactions:
        token_contract_address = tx.get('contractAddress', '')
        token_balance = float(tx.get('value', 0)) / (10 ** int(tx.get('tokenDecimal', 0)))
        token_name = tx.get('tokenName', '')
        token_symbol = tx.get('tokenSymbol', '')

        if token_contract_address:
            if token_contract_address not in token_balances:
                token_balances[token_contract_address] = {'name': token_name, "symbol": token_symbol, 'balance': 0}
            token_balances[token_contract_address]['balance'] += token_balance

    if token_balances:
        return token_balances, None
    else:
        return None, 'Failed to get token balances'