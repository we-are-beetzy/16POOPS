//
//  ServerTableController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/17/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class ServerTableController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    struct TableStatus {
        
        var status : String!
        var tables: [Table]!
    }
    
    var assignedTables = [String]()
    var availableTables = TableStatus()
    var seatedTables = TableStatus()
    
    var tableArray = [TableStatus]()
    
    var closePressed: Bool = false

    override func viewDidLoad() {
        
        super.viewDidLoad()
        tableView.register(CustomTableCell.self, forCellReuseIdentifier: "cell")
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(handleLogout))
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Close", style: .plain, target: self, action: #selector(handleClose))
        
        navigationItem.rightBarButtonItem?.tintColor = CustomColor.gray
        
        navigationItem.title = "Tables"
        
        fetchServerTables()
        fetchTables()
    }
    
    func handleLogout() {
        do{
            try FIRAuth.auth()?.signOut()
        }catch let logoutError {
            print(logoutError)
        }
        dismiss(animated: true, completion: nil)
    }
    
    func handleClose() {
        if closePressed {
            navigationItem.rightBarButtonItem?.tintColor = CustomColor.gray
            closePressed = false
        }else {
            navigationItem.rightBarButtonItem?.tintColor = CustomColor.Yellow500
            closePressed = true
        }
        
    }
    
    func initTableStructs() {
        
        tableArray = [TableStatus]()
        
        availableTables.status = "Available"
        seatedTables.status = "Seated"
        availableTables.tables = [Table]()
        seatedTables.tables = [Table]()
        
        tableArray.append(seatedTables)
        tableArray.append(availableTables)
    }
    
    func fetchServerTables() {
        
        ref.child("Users").child("Server").child((FIRAuth.auth()?.currentUser?.uid)!).child("assignedTables").observe(.value, with: { (snapshot) in
            
            if let tables = snapshot.value as! [String]? {
                self.assignedTables = tables
            }
            
        })
    }
    
    func fetchTables() {
        ref.child("Tables").observe(.value, with: { (snapshot) in
            
            self.initTableStructs()
            
            for eachTable in snapshot.children {
                
                let table = Table()
                
                let thisTable = eachTable as! FIRDataSnapshot
                
                if self.assignedTables.contains(thisTable.key) {
                    
                    if let dict = thisTable.value as? [String : AnyObject] {
                        
                        if let capacityInt = dict["capacity"] as? Int?{
                            table.capacity = capacityInt
                        }else if let capacityString = dict["capacity"] as? String?{
                            table.capacity = Int(capacityString!)
                        }else {
                            table.capacity = 0
                        }
                        
                        table.name = dict["name"] as! String?
                        table.key = (eachTable as!FIRDataSnapshot).key
                        table.status = dict["status"] as! String?
                        table.reservationName = dict["reservationName"] as! String?
                        table.orders = dict["Orders"] as! [String]?
                        
                        if(table.status == "Seated"){
                            self.tableArray[0].tables.append(table)
                        }else if table.status == "Available"{
                            self.tableArray[1].tables.append(table)
                        }
                    }
                }
            }
            
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
            
        })
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> CustomTableCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! CustomTableCell
        
        cell.textLabel?.text = tableArray[indexPath.section].tables[indexPath.row].name
        cell.detailTextLabel?.text = tableArray[indexPath.section].tables[indexPath.row].reservationName!
        
        cell.setColors()
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        if closePressed {
        ref.child("Tables").child(tableArray[indexPath.section].tables[indexPath.row].key!).child("status").setValue("Available")
        ref.child("Tables").child(tableArray[indexPath.section].tables[indexPath.row].key!).child("newStatus").setValue("true")
            
            
            
        }else {
            let tableInfoController = TableInfoViewController()
            tableInfoController.selectedTable = tableArray[indexPath.section].tables[indexPath.row]
            
            let navController = CustomNavigationController(rootViewController: tableInfoController)
            
            present(navController, animated: true, completion: nil)
        }
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return tableArray.count
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return tableArray[section].status
    }
    
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        view.tintColor = CustomColor.Yellow500
        (view as! UITableViewHeaderFooterView).textLabel?.textColor = UIColor.black
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return tableArray[section].tables.count
    }
    
}
