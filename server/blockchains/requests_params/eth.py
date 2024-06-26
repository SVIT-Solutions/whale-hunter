class Params:
    def __init__(self, api_key):
        self.api_key = api_key


    def get_fetch_wallet_transactions_params(self, wallet_address=None):
        return {
            'module': 'account',
            'action': 'tokentx',
            'apikey': self.api_key,
            'address': wallet_address,
            'sort': 'asc',
        }


    def get_fetch_wallet_token_balance_params(self, wallet_address=None, contract_address=None):
        return {
            'module': 'account',
            'action': 'tokenbalance',
            'apikey': self.api_key,
            'address': wallet_address,
            'contractaddress': contract_address,
            'sort': 'asc',
        }