Access [http://localhost:3000/champions](http://localhost:3000/champions) and press a champion icon to look at the information

TO DOS:

# Working on

- Making page look more visually pleasing

# MAJOR PROBLEMS

- If skills need target max health, add it to the skill description calculation (ex. 60 + 4% max hp)
- Fix "mapped" component keys (problem lies in having purchased multiple of the same item. need to differentiate same items)
- Need to add caclulations for attack speed
- Shop needs to follow HoverableItem where it parses the calculations in item active/passives
- Some items cannot be bought due to problems in interpreting differences for ranged/melee stats for HoverableItem
- Some items (ex. Dark Seal) have an infinite loop when passive/active is parsed through HoverableItem

# MINOR PROBLEMS

- Buying mana items should not increase the mana for Energy / Fury champions
  - Would be nice to have these champs have "energy / fury" shown up as text instead of "mana"
- Properly make only 1 mythic per inventory and other niche / unique instances
- Make everything look better
- Inventory.jsx --> Ornn border should use current patch border
- Inventory.jsx --> Make sure if the icon does not exist, use a temporary image
- Item hit effect and tip have to add symbols
- Need to round to 2 decimals for Item numerized stats
- Replace logo image in navbar
- Some words need to be checked when adding color to text to account for suffixes (ex. Syndra W uses "slowed" but only "slow" is colored)
- Occassional bug where changing Chmapion Level focuses / forces a jump toward the Select and randomly picks a value depending on where your cursor is on the Select Menu. (this is jarring to see happen)
- Pressing the Shop button adds a horizontal scrollbar (need to remove this)
- Need a better way to add a blank div under the Shop / row of items to give it a margin/padding. (look for the comment that reads "TEMPORARY WAY TO ADD A "FOOTER-ESQUE" thing to the shop")
