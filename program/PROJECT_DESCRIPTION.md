# Project Description

**Deployed Frontend URL:** [Link](https://notesapp-delta-five.vercel.app/)

**Solana Program ID:** 7YLJ1sK4aRMzRzqkPrHchAGEa9kfKYr5XTgsPMVVSHAJ

## Project Overview

### Description
A simple decentralized notes application built on Solana. Users can create notes, edit, and delete them. Created notes are derived from user wallet address, ensuring data ownership. This dApp demonstrates simple concepts like PDAs, account creation and closing, data management.

### Key Features
- **Create Note**: Initialize a new note account for your wallet with name and value
- **Edit Note**: Changes value data field
- **Delete Note**: Closes note account, getting back the rent
- **View All User Notes**: Display all notes the user has created, as well as creation date, author and note name with value
  
### How to Use the dApp
1. **Connect Wallet** - Connect your Solana wallet
2. **Connect Wallet** - Select cluster (Devnet or Testnet)
3. **Create Note** - Click "+ New Note" to open note creation form, fill in desired Note name and content, click Create Note
4. **Edit Note** - Click on Edit button near the Note, fill in new value and click Save
5. **Delete Note**- Click Delete, confirm to delete
6. **View Notes** - See all your Notes list as it is updated

## Program Architecture
The Notes dApp uses a simple architecture with one main account type and three core instructions. The program leverages PDAs to create many note accounts for each user including wallet address and Note name as part of seeds, ensuring data isolation and preventing conflicts between different users' notes.

### PDA Usage
The program uses Program Derived Addresses to create deterministic Note accounts for each user, I used 3 seed types: constant name "Notes" unique to the program, wallet address for users conflict prevention and finally Note name for isolation.

**PDAs Used:**
- **Note PDA**: Derived from seeds `["Notes", user_wallet_pubkey, note_name]` - ensures each user can have unique note accounts that only they can modify

### Program Instructions
**Instructions Implemented:**
- **InitializeNote**: Creates a new note account for the user with name, message, creation date and author
- **EditNote**: Edits note message
- **CloseNote**: Closes note account

**Instructions Implemented:**
- Instruction 1: [Description of what it does]
- Instruction 2: [Description of what it does]
- ...

### Account Structure
```rust
#[account]
pub struct Note {
    pub author:Pubkey,              //creator/author of the note
    pub init_time: i64,             //time of when note was created
    #[max_len(MAX_NAME_SIZE)]
    pub name: String,               //name of the note
      #[max_len(MAX_VALUE_SIZE)]
    pub value: String,              //message of the note
}
```

## Testing

### Test Coverage
[TODO: Describe your testing approach and what scenarios you covered]
Tests cover all instructions, mixing up accounts to ensure the intended program execution.
**Happy Path Tests:**
- **Creates first note intended way**: Successful when accounts used are passed in correctly
- **Closes note intended way**: Successful when accounts used are passed in correctly 
- **Edits note intended way**: Successful when accounts used are passed in correctly 

**Unhappy Path Tests:**
- **Fails to create note second time**: Fails when trying to create note that already exists
- **Fails to create note for another user** : Fails when signer is different from note owner for creating note
- **Fails to close note for another user**: Fails when signer is different from note owner for closing note
- **Fails to close note second time**: Fails when trying to close note that is already closed
- **Fails to edit note for another user**: Fails when signer is different from note owner for editing note
- **Fails to edit closed note**: Fails when trying to edit note that is closed/does not exist

### Running Tests
```bash
# Commands to run your tests
yarn install    # install dependencies
anchor test
```

### Additional Notes for Evaluators
This is my first program deployed to devnet, second time joining School of Solana. Had trouble understanding how to properly set up local validator for testing, reference IDL correctly in the frontend, as many sources do it differently. It is more clear how program flows when deployed.

Using Bun as package manager for frontend, also created a script to copy IDL with types from program to frontend for easier referencing:
```bash
cd frontend
bun run copy-idl
```