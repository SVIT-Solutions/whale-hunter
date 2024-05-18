import requests
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


    def fetch_data_by_params(self, params, error_message):
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
                    return None, None, error_message
            else:
                return None, None, f'Failed to fetch data from Etherscan API. Status code: {response.status_code}'
        except Exception as e:
            return None, None, str(e)


    def fetch_token_balance_by_contract_adress(self, wallet_address, contract_address, params_instance):
        fetch_wallet_token_balance_params = params_instance.get_fetch_wallet_token_balance_params(
                wallet_address=wallet_address, contract_address=contract_address)
        token_balance, token_balance_error = self.fetch_data_by_params(
                params=fetch_wallet_token_balance_params, error_message='No transaction data found in the response')
        return token_balance


    @staticmethod
    def format_transactions_data(transactions):
        return [{
            'from_address': transaction.get('from'),
            'to_address': transaction.get('to'),
            'value': transaction.get('value'),
            'tokenSymbol': transaction.get('tokenSymbol'),
            'tokenDecimal': int(transaction.get('tokenDecimal', 1)),
            'contractAddress': transaction.get('contractAddress'),
            'tokenName': transaction.get('tokenName'),
            'timeStamp': transaction.get('timeStamp')
        } for transaction in transactions]