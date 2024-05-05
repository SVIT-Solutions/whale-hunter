class Params:
    def __init__(self, api_key):
        self.api_key = api_key


    def get_fetch_wallet_transactions_params(self, wallet_address=None):
        return {
            'apikey': self.api_key,
            'address': wallet_address,
            'sort': 'asc',
            'module': 'account',
            'action': 'tokentx'
        }

    def get_transactions_for_coin_params(self, coin_address,):
        return {
            'apikey': self.api_key,
            'address': coin_address,
            'sort': 'asc',
            'module': 'account',
            'action': 'tokentx'
        }