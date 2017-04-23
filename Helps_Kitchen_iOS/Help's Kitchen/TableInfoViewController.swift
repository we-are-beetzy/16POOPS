//
//  TableInfoViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/23/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class TableInfoViewController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    var selectedTable: Table?
    
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
        
        navigationItem.title = "Tables"
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", style: .plain, target: self, action: #selector(handleCancel))
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Add Order", style: .plain, target: self, action: #selector(handleNewOrder))
        // Do any additional setup after loading the view.
        
        fetchTableOrders()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        fetchTableOrders()
    }
    
    func initOrderArrays(){
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

    
    func fetchTableOrders() {
        
        ref.child("Orders").observeSingleEvent(of: .value, with: { (snapshot) in
            
            self.initOrderArrays()
            
            let orderListSnapshot = snapshot.childSnapshot(forPath: "OrderList")
            
            for eachOrderStatus in snapshot.children {
                let thisOrderStatus = eachOrderStatus as! FIRDataSnapshot
                
                if thisOrderStatus.key != "OrderList" {
                    
                    if let keyArray = (thisOrderStatus.value as! [AnyObject]?) {
                        
                        var stringArray = [String]()
                        
                        for key in keyArray {
                            if let str = key as? String{
                                stringArray.append(str)
                            }else if let num = key as? Int{
                                stringArray.append(String(describing: num))
                            }
                        }
                        
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
                    
                    if key != "" && selectedTable?.key == tableKey {
                        
                        if let dict = orderListSnapshot.childSnapshot(forPath: String( describing:key)).value as! [String : AnyObject]? {
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
    
    func handleCancel() {
        dismiss(animated: true, completion: nil)
    }
    
    func handleNewOrder() {
        let orderController = NewOrderViewController()
        orderController.selectedTable = self.selectedTable
        
        present(orderController, animated: true, completion: nil)
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
