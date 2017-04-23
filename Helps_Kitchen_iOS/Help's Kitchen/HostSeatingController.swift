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
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    struct TableStatus {
        var status : String!
        var tables: [Table]!
    }
    var availableTables = TableStatus()
    var closingTables = TableStatus()
    var seatedTables = TableStatus()
    
    var tableArray = [TableStatus]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let twoLineTitleView = UIView()
        
        
        
        let titleLabel = UILabel()
        
        let subTitleLabel = UILabel()
        
        view.addSubview(twoLineTitleView)
        twoLineTitleView.addSubview(titleLabel)
        twoLineTitleView.addSubview(subTitleLabel)
        
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.backgroundColor = UIColor.clear
        titleLabel.textColor = CustomColor.UCFGold
        titleLabel.text = "Tables";
        titleLabel.centerXAnchor.constraint(equalTo: twoLineTitleView.centerXAnchor).isActive = true
        titleLabel.topAnchor.constraint(equalTo: twoLineTitleView.topAnchor).isActive = true
        titleLabel.heightAnchor.constraint(equalToConstant: 20).isActive = true
        
        subTitleLabel.font = UIFont(name: subTitleLabel.font.fontName, size: 10)
        subTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        subTitleLabel.backgroundColor = UIColor.clear
        subTitleLabel.textColor = CustomColor.white
        subTitleLabel.text = "Capacity - Reservation";
        subTitleLabel.centerXAnchor.constraint(equalTo: twoLineTitleView.centerXAnchor).isActive = true
        subTitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor).isActive = true
        subTitleLabel.heightAnchor.constraint(equalToConstant: 12).isActive = true
        
        
        twoLineTitleView.translatesAutoresizingMaskIntoConstraints = false
        twoLineTitleView.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        twoLineTitleView.heightAnchor.constraint(equalToConstant: 35).isActive = true
        twoLineTitleView.topAnchor.constraint(equalTo: view.topAnchor, constant: 0).isActive = true
        
         
        
        
        self.navigationItem.titleView = twoLineTitleView;
        
        tableView.register(UITableViewCell.self , forCellReuseIdentifier: "cell")
        fetchTables()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(handleLogout))
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "+", style: .plain, target: self, action: #selector(handleNewReservation))
    }
    
    func handleLogout() {
        do{
            try FIRAuth.auth()?.signOut()
        }catch let logoutError {
            print(logoutError)
        }
        dismiss(animated: true, completion: nil)
    }
    
    func handleNewReservation() {
        
        let newResController = NewReservationController()
        
        let navController = CustomNavigationController(rootViewController: newResController)
        
        present(navController, animated: true, completion: nil)
    }
    
    func initTableStructs() {
        
        tableArray = [TableStatus]()
        
        availableTables.status = "Available"
        seatedTables.status = "Seated"
        closingTables.status = "Closing"
        availableTables.tables = [Table]()
        closingTables.tables = [Table]()
        seatedTables.tables = [Table]()
        
        tableArray.append(availableTables)
        tableArray.append(closingTables)
        tableArray.append(seatedTables)
    }
    
    func fetchTables() {
        
        ref.child("Tables").observe(.value, with: { (snapshot) in
            
            self.initTableStructs()
            
            print(snapshot)
            
            for eachTable in snapshot.children {
            
                let table = Table()
            
                if let dict = (eachTable as! FIRDataSnapshot).value as? [String : AnyObject] {
                    
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
                    table.newStatus = dict["newStatus"] as! String?
                    
                    if(table.status == "Available"){
                        self.tableArray[0].tables.append(table)
                    }else if table.status == "Closing"{
                        self.tableArray[1].tables.append(table)
                    }else if table.status == "Seated"{
                        self.tableArray[2].tables.append(table)
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
        view.tintColor = CustomColor.UCFGold
        (view as! UITableViewHeaderFooterView).textLabel?.textColor = UIColor.black
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return tableArray[section].tables.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "") ?? UITableViewCell(style: .subtitle, reuseIdentifier: "cell")
        
        if indexPath.section == 0{
            cell.detailTextLabel?.text = String(describing: tableArray[indexPath.section].tables[indexPath.row].capacity!) + " - " + tableArray[indexPath.section].tables[indexPath.row].reservationName!
            cell.accessoryType = UITableViewCellAccessoryType.disclosureIndicator
        }else{
            cell.detailTextLabel?.text = String(describing: tableArray[indexPath.section].tables[indexPath.row].capacity!)
        }
        cell.backgroundColor = CustomColor.black
        cell.textLabel?.text = tableArray[indexPath.section].tables[indexPath.row].name
        cell.textLabel?.textColor = CustomColor.UCFGold
        cell.detailTextLabel?.textColor = CustomColor.white
        
        if (tableArray[indexPath.section].tables[indexPath.row].newStatus == "true")
        {
            cell.textLabel?.textColor = CustomColor.green
            cell.backgroundColor = UIColor.black
            
            cell.textLabel?.alpha = 1
            UIView.animate(withDuration: 0.7, delay: 0.0, options: [.repeat, .autoreverse, ], animations:
                {
                    UIView.setAnimationRepeatCount(5)
                    cell.textLabel?.alpha = 0
            }, completion: { (finished: Bool) in
                cell.textLabel?.textColor = CustomColor.UCFGold
                cell.textLabel?.alpha = 1
            })
            
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        if indexPath[0] == 0  {
            let assignToTableController = AssignToTableController()
            assignToTableController.selectedTable = tableArray[indexPath.section].tables[indexPath.row]
            let navController = CustomNavigationController(rootViewController: assignToTableController)
            present(navController, animated: true, completion: nil)
        } else if indexPath[0] == 1 || indexPath[0] == 2{
            let seatedController = SeatedTableViewController()
            seatedController.selectedTable = tableArray[indexPath.section].tables[indexPath.row]
            let navController = CustomNavigationController(rootViewController: seatedController)
            present(navController, animated: true, completion: nil)
        }
    }
}
