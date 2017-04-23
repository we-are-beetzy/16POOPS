//
//  AssignToTableController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/17/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class AssignToTableController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: "https://helps-kitchen.firebaseio.com/")
    
    var selectedTable: Table?
    
    var seatingQueueIds = [String]()
    var seatingQueueUsers = [User]()

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.register(CustomTableCell.self, forCellReuseIdentifier: "cell")
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", style: .plain, target: self, action: #selector(handleCancel))
        
        fetchSeatingQueue()

        // Do any additional setup after loading the view.
    }
    
    func handleCancel() {
        dismiss(animated: true, completion: nil)
    }
    
    func fetchSeatingQueue() {
        
        ref.child("misc").child("seatingQueue").observe(.value, with: { (snapshot) in
            print(snapshot)
            self.seatingQueueIds = ((snapshot.value) as! [String])
            
            
        })
        ref.child("users").observeSingleEvent(of: .value, with: { (snapshot) in
            
            for eachUser in snapshot.children {
                
                let thisUser = eachUser as! FIRDataSnapshot
                
                
                if (self.seatingQueueIds.contains(thisUser.key)){
                    
                    if let dict = (eachUser as! FIRDataSnapshot).value as? [String: AnyObject] {
                        
                        let tempUser = User()
                        
                        tempUser.name = dict["name"] as? String
                        tempUser.uid = (eachUser as! FIRDataSnapshot).key
                        
                        self.seatingQueueUsers.append(tempUser)
                    }
                }
            }
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
        })
        
        
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    //TODO: Add overrides for num section, etc.
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return seatingQueueUsers.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        
        cell.textLabel?.text = seatingQueueUsers[indexPath.row].name
        cell.textLabel?.textColor = CustomColor.amber500
        cell.backgroundColor = UIColor.black
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        //remove from seatingQueue
        removeUserFromQueue(index: indexPath.row)
        //add to table
        ref.child("tables").child((selectedTable?.key)!).child("user").setValue(seatingQueueUsers[indexPath.row].uid)
        ref.child("users").child(seatingQueueUsers[indexPath.row].uid!).child("customerIsSeated").setValue(true)
        
        //change table status
        ref.child("tables").child((selectedTable?.key)!).child("tableStatus").setValue("seated")
    }
    
    func removeUserFromQueue(index: Int){
        
        var tempQueue = [String]()
        
        for user in seatingQueueUsers {
            tempQueue.append(user.uid!)
        }
        
        if tempQueue.count == 1 {
            tempQueue[index] = ""
        }else {
            tempQueue.remove(at: index)
        }
        
        ref.child("misc").child("seatingQueue").setValue(tempQueue)
        dismiss(animated: true, completion: nil)
    }
    
    
}
