//
//  ServerOrderViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 4/1/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class ServerOrderViewController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    struct OrderStatus {
        var keys: [String]!
        var status: String!
        var orders: [Order]!
    }
    
    var serverTables: [String]?
    
    var placedOrders = OrderStatus()
    var inProgressOrders = OrderStatus()
    var readyOrders = OrderStatus()
    var seeKitchenOrders = OrderStatus()
    
    var orderArray = [OrderStatus]()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.register(CustomTableCell.self, forCellReuseIdentifier: "cell")
        
        navigationItem.title = "Orders"
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(handleLogout))

        // Do any additional setup after loading the view.
        fetchServerTables()
        fetchOrders()
    }
    
    func handleLogout() {
        do{
            try FIRAuth.auth()?.signOut()
        }catch let logoutError {
            print(logoutError)
        }
        dismiss(animated: true, completion: nil)
    }
    
    func fetchServerTables() {
            
        ref.child("Users").child("Server").child((FIRAuth.auth()?.currentUser?.uid)!).child("assignedTables").observe(.value, with: { (snapshot) in
                
            if let tables = snapshot.value as! [String]? {
                self.serverTables = tables
            }
                
        })
    }
    
    func initOrderStructs() {
        
        orderArray = [OrderStatus]()
        
        placedOrders.status = "Placed"
        inProgressOrders.status = "In Progress"
        readyOrders.status = "Ready"
        seeKitchenOrders.status = "See Kitchen"
        
        placedOrders.orders = [Order]()
        inProgressOrders.orders = [Order]()
        readyOrders.orders = [Order]()
        seeKitchenOrders.orders = [Order]()
        
    }
    
    func fetchOrders() {
        
        ref.child("Orders").observe(.value, with: { (snapshot) in
            
            self.initOrderStructs()
            
            let orderListSnapshot = snapshot.childSnapshot(forPath: "OrderList")
            
            for eachOrderStatus in snapshot.children {
                let thisOrderStatus = eachOrderStatus as! FIRDataSnapshot
                
                if thisOrderStatus.key != "OrderList" {
                    
                    if let stringArray = (thisOrderStatus.value as! [String]?) {
                        
                        switch thisOrderStatus.key {
                        case "Placed":
                            self.placedOrders.keys = stringArray
                            self.placedOrders.orders = self.getOrdersWith(keyArray: stringArray, orderListSnapshot: orderListSnapshot)
                        case "InProgress":
                            self.inProgressOrders.keys = stringArray
                            self.inProgressOrders.orders = self.getOrdersWith(keyArray: stringArray, orderListSnapshot: orderListSnapshot)
                        case "SeeKitchen":
                            self.seeKitchenOrders.keys = stringArray
                            self.seeKitchenOrders.orders = self.getOrdersWith(keyArray: stringArray, orderListSnapshot: orderListSnapshot)
                        case "Ready":
                            self.readyOrders.keys = stringArray
                            self.readyOrders.orders = self.getOrdersWith(keyArray: stringArray, orderListSnapshot: orderListSnapshot)
                        default:
                            print("not one of those")
                        }
                    }
                }
            }
            
            self.orderArray.append(self.readyOrders)
            self.orderArray.append(self.seeKitchenOrders)
            self.orderArray.append(self.inProgressOrders)
            self.orderArray.append(self.placedOrders)
            
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
        })
    }
    
    func getOrdersWith(keyArray: [String], orderListSnapshot: FIRDataSnapshot) -> [Order] {
        
        var orders = [Order]()
        
        for key in keyArray{
            
            if key != "" {
                
                if let tableKey = orderListSnapshot.childSnapshot(forPath: key).childSnapshot(forPath: "tableKey").value as? String {
                    
                    if key != "" && (serverTables?.contains(tableKey))!{
                        
                        if let dict = orderListSnapshot.childSnapshot(forPath: key).value as! [String : AnyObject]? {
                            let order = Order()
                            
                            order.setValuesForKeys(dict)
                            orders.append(order)
                        }
                    }
                }
            }
        }
        
        return orders
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> CustomTableCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! CustomTableCell
        
        cell.textLabel?.text = orderArray[indexPath.section].orders[indexPath.row].item
        cell.setColors()
        return cell
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return orderArray.count
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return orderArray[section].status
    }
    
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        view.tintColor = CustomColor.Yellow500
        (view as! UITableViewHeaderFooterView).textLabel?.textColor = UIColor.black
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return orderArray[section].orders.count
    }
    
}
