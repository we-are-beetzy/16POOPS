//
//  HostSeatingController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/15/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class HostSeatingController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: "https://helps-kitchen.firebaseio.com/")
    
    struct TableStatus {
        
        var status : String!
        var tables: [Table]!
    }
    var availableTables = TableStatus()
    var seatedTables = TableStatus()
    
    var tableArray = [TableStatus]()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.register(CustomTableCell.self, forCellReuseIdentifier: "cell")
        initTableStructs()
        fetchTables()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(handleLogout))
        
    }
    
    func handleLogout() {
        do{
            try FIRAuth.auth()?.signOut()
        }catch let logoutError {
            print(logoutError)
        }
        dismiss(animated: true, completion: nil)
        
    }
    
    func initTableStructs() {
        
        availableTables.status = "Available"
        seatedTables.status = "Seated"
        availableTables.tables = [Table]()
        seatedTables.tables = [Table]()
        
        tableArray.append(availableTables)
        tableArray.append(seatedTables)
    }
    
    func fetchTables() {
        ref.child("tables").observeSingleEvent(of: .value , with: { (snapshot) in
            print(snapshot)
            
            for eachTable in snapshot.children {
                
                let table = Table()
                
                if let dict = (eachTable as! FIRDataSnapshot).value as? [String : AnyObject] {
                    
                    
                    table.name = dict["tableName"] as! String?
                    table.key = (eachTable as!FIRDataSnapshot).key
                    table.status = dict["tableStatus"] as! String?
                    
                    if(table.status == "available"){
                        self.tableArray[0].tables.append(table)
                    }else if table.status == "seated"{
                        self.tableArray[1].tables.append(table)
                    }
                }
            }
            
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
            
        })
    }

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return tableArray.count
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return tableArray[section].status
    }
    
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        view.tintColor = CustomColor.amber500
        (view as! UITableViewHeaderFooterView).textLabel?.textColor = UIColor.black
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return tableArray[section].tables.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        
        cell.textLabel?.text = tableArray[indexPath.section].tables[indexPath.row].name
        cell.textLabel?.textColor = CustomColor.amber500
        cell.backgroundColor = UIColor.black
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let assignToTableController = AssignToTableController()
        assignToTableController.selectedTable = tableArray[indexPath.section].tables[indexPath.row]
        
        let navController = UINavigationController(rootViewController: assignToTableController)
         ref.child("misc").child("seatingQueue")
        present(navController, animated: true, completion: nil)
    }

}
