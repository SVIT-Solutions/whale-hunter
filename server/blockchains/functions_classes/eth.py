import requests
import datetime
from urllib.parse import urlencode


class Functions:
    def __init__(self, api_key):
        self.api_key = api_key

    @staticmethod
    def check_address_validity(wallet_address):
        if len(wallet_address) != 42 or not wallet_address.startswith('0x'):
            return False
        try:
            int(wallet_address, 16)
        except ValueError:
            return False
        return True

    def fetch_transactions(self, params):
        if params is None:
            return None, None, 'Request params not provided'

        params_encoded = urlencode(params)
        url = f'https://api.etherscan.io/api?{params_encoded}'

        try:
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                if 'result' in data:
                    return data['result'], None
                else:
                    return None, None, 'No transaction data found in the response'
            else:
                return None, None, f'Failed to fetch data from Etherscan API. Status code: {response.status_code}'
        except Exception as e:
            return None, None, str(e)

    @staticmethod
    def calculate_token_balances(transactions):
        token_balances_dict = {}
        for tx in transactions:
            token_contract_address = tx.get('contractAddress', '')
            token_balance = float(tx.get('value', 0)) / (10 ** int(tx.get('tokenDecimal', 0)))
            token_name = tx.get('tokenName', '')
            token_symbol = tx.get('tokenSymbol', '')
            if token_contract_address:
                if token_contract_address not in token_balances_dict:
                    token_balances_dict[token_contract_address] = {'name': token_name, "symbol": token_symbol, 'balance': 0}
                token_balances_dict[token_contract_address]['balance'] += token_balance

        token_balances = []
        for address, data in token_balances_dict.items():
            token_balance_data = {
                'token_contract_address': address,
                'name': data['name'],
                'symbol': data['symbol'],
                'balance': data['balance']
            }
            token_balances.append(token_balance_data)
        if token_balances:
            return token_balances, None
        else:
            return None, 'Failed to get token balances'

    @staticmethod
    def format_transactions_data(transactions):
        return [{
            'from_address': transaction.get('from'),
            'to_address': transaction.get('to'),
            'value': transaction.get('value'),
            'tokenSymbol': transaction.get('tokenSymbol'),
            'tokenName': transaction.get('tokenName'),
            'timeStamp': transaction.get('timeStamp')
        } for transaction in transactions]