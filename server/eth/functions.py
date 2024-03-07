import requests


# Etherscan API
def fetch_token_balance(wallet_address, latest_block, api_key):
    url = f'https://api.etherscan.io/api?module=account&action=tokentx&address={wallet_address}&startblock=0&endblock={latest_block}&sort=asc&apikey={api_key}'

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()

            if 'result' in data:
                token_balances = {}

                for tx in data['result']:
                    token_contract_address = tx['contractAddress']
                    token_balance = float(tx['value']) / (10 ** int(tx['tokenDecimal']))
                    token_name = tx['tokenName']
                    token_symbol = tx['tokenSymbol']

                    if token_contract_address not in token_balances:
                        token_balances[token_contract_address] = {'name': token_name, "symbol": token_symbol, 'balance': 0}
                    token_balances[token_contract_address]['balance'] += token_balance

                if token_balances:
                    return token_balances, None
                else:
                    return None, 'Failed to get token balances'
            else:
                return None, 'No token transaction data found in the response'
        else:
            return None, f'Failed to fetch data from Etherscan API. Status code: {response.status_code}'
    except Exception as e:
        return None, str(e)


def fetch_latest_block_number(api_key):
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