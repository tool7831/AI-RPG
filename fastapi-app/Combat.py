from Enemy import Enemy
def combat(json):
    return Enemy(json)


# {'Combat': {'Monster Name': 'Rogue Demon',
#   'Monster Description': 'A malevolent creature with burning red eyes and charred wings, cloaked in dark mist. It preys on travelers, disrupting the natural balance of Blackwood Forest.',
#   'status': {'HP': 300,
#    'MP': 50,
#    'Strength': 40,
#    'Dexterity': 10,
#    'Intelligence': 20,
#    'Luck': 5,
#    'Defense': 20,
#    'Speed': 10,
#    'Concentration': 15,
#    'Reaction': 10,
#    'MP Regeneration': 1,
#    'HP Regeneration': 1}},
#  'Reward': {'gold': 200, 'exp': 150},
#  'Item': {'Item types': 'Weapon',
#   'Item Name': 'Demon Slasher',
#   'Item Description': 'A cursed sword forged in the Underworld. It is exceptionally efficient against demonic beings.',
#   'Use Restriction': {'Strength': 25},
#   'Effect': {'Strength': 25, 'Luck': -5}}}