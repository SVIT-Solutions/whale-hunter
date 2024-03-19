class Params:
    def __init__(self, api_key):
        self.api_key = api_key

    def get_fetch_wallet_transactions_params(self, wallet_address=None, latest_block=999999999):
        return {
            'apikey': self.api_key,
            'address': wallet_address,
            'endblock': latest_block,
            'startblock': 0,
            'sort': 'asc',
            'module': 'account',
            'action': 'tokentx'
        }