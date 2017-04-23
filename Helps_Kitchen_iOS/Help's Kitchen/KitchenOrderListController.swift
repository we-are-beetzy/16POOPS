//
//  OrderedItemList.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 3/6/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class KitchenOrderListController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    struct OrderStatus {
        var keys: [String]!
        var status: String!
        var orders: [Order]!
    }
    
    var placedOrders = OrderStatus()
    var inProgressOrders = OrderStatus()
    var readyOrders = OrderStatus()
    var seeKitchenOrders = OrderStatus()
    
    var orderArray = [OrderStatus]()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.register(CustomTableCell.self, forCellReuseIdentifier: "cell")
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(handleLogout))

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
                    
                    print(thisOrderStatus.key)
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
                
                if let dict = orderListSnapshot.childSnapshot(forPath: key).value as! [String : AnyObject]? {
                    let order = Order()
                    
                    order.setValuesForKeys(dict)
                    orders.append(order)
                }
            }
        }
        
        return orders
    }
    
    func moveSelectedOrder(at: IndexPath, from: FIRDataSnapshot, to: FIRDataSnapshot) {
        var fromArray = from.value as! [String]?
        var temp: String?
        
        var toArray = to.value as! [String]?
        
        if fromArray?.count == 1 {
            temp = fromArray?.remove(at: at.row)
            fromArray?.append("")
        }else{
            temp = fromArray?.remove(at: at.row)
        }
        
        if temp != nil {
            if toArray?[0] == ""{
                toArray?[0] = temp!
            }else{
                toArray?.append(temp!)
            }
            
            ref.child("Orders").child(from.key).setValue(fromArray)
            ref.child("Orders").child(to.key).setValue(toArray)
        }
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        ref.child("Orders").observeSingleEvent(of: .value, with: {(snapshot) in
            
            let ready = snapshot.childSnapshot(forPath: "Ready")
            let seeKitchen = snapshot.childSnapshot(forPath: "SeeKitchen")
            let inProgress = snapshot.childSnapshot(forPath: "InProgress")
            let placed = snapshot.childSnapshot(forPath: "Placed")
            
            
            switch indexPath.section{
                case 0://Ready
                    
                    let changeStatusAlert = UIAlertController(title: "Change Order Status", message: "Select the Order's new status.", preferredStyle: UIAlertControllerStyle.alert)
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "See Kitchen", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: ready, to: seeKitchen)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "In Progress", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: ready, to: inProgress)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "Placed", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: ready, to: placed)
                    }))
                
                    self.present(changeStatusAlert, animated: true, completion: nil)
                case 1://See Kitchen
                    let changeStatusAlert = UIAlertController(title: "Change Order Status", message: "Select the Order's new status.", preferredStyle: UIAlertControllerStyle.alert)
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "Ready", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: seeKitchen, to: ready)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "In Progress", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: seeKitchen, to: inProgress)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "Placed", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: seeKitchen, to: placed)
                    }))
                
                    self.present(changeStatusAlert, animated: true, completion: nil)
                case 2://In Progress
                    let changeStatusAlert = UIAlertController(title: "Change Order Status", message: "Select the Order's new status.", preferredStyle: UIAlertControllerStyle.alert)
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "Ready", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: inProgress, to: ready)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "See Kitchen", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: inProgress, to: seeKitchen)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "Placed", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: inProgress, to: placed)
                    }))
                
                    self.present(changeStatusAlert, animated: true, completion: nil)
                case 3://Placed
                    let changeStatusAlert = UIAlertController(title: "Change Order Status", message: "Select the Order's new status.", preferredStyle: UIAlertControllerStyle.alert)
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "Ready", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: placed, to: ready)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "See Kitchen", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: placed, to: seeKitchen)
                    }))
                    
                    changeStatusAlert.addAction(UIAlertAction(title: "In Progress", style: .default, handler: { (action: UIAlertAction!) in
                        self.moveSelectedOrder(at: indexPath, from: placed, to: inProgress)
                    }))
                
                    self.present(changeStatusAlert, animated: true, completion: nil)
            default:
                print("None of those")
            }
            
            tableView.cellForRow(at: indexPath)?.isSelected = false
        })
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "") ?? UITableViewCell(style: .subtitle, reuseIdentifier: "cell")
        
        cell.detailTextLabel?.text = orderArray[indexPath.section].orders[indexPath.row].tableKey
        cell.backgroundColor = CustomColor.black
        cell.textLabel?.text = orderArray[indexPath.section].orders[indexPath.row].item
        cell.textLabel?.textColor = CustomColor.UCFGold
        cell.detailTextLabel?.textColor = CustomColor.white
        
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
