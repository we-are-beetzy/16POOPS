//
//  NewFoodViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 4/2/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class NewFoodViewController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    var selectedTable: Table?
    
    struct FoodType {
        var keys: [String]!
        var type: String!
        var items: [MenuItem]!
    }
    
    var appetizers = FoodType()
    var desserts = FoodType()
    var entrees = FoodType()
    var sides = FoodType()
    
    var foodArray = [FoodType]()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.register(CustomTableCell.self, forCellReuseIdentifier: "cell")
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(handleCancel))

        // Do any additional setup after loading the view.
        
        fetchMenu()
    }
    
    func initFoodTypes() {
        
        foodArray = [FoodType]()
        
        appetizers.type = "Appetizers"
        desserts.type = "Desserts"
        entrees.type = "Entrees"
        sides.type = "Sides"
        
        appetizers.items = [MenuItem]()
        desserts.items = [MenuItem]()
        entrees.items = [MenuItem]()
        sides.items = [MenuItem]()
    }
    
    func fetchMenu(){
        
        ref.child("Menu").observeSingleEvent(of: .value, with: { (snapshot) in
            
            self.initFoodTypes()
            
            let foodSnapshot = snapshot.childSnapshot(forPath: "Food")
            
            for eachFoodType in foodSnapshot.children {
                let thisFoodType = eachFoodType as! FIRDataSnapshot
                
                if let stringArray = thisFoodType.value as! [String]? {
                    
                    switch thisFoodType.key {
                    case "Appetizers":
                        self.appetizers.keys = stringArray
                        self.appetizers.items = self.getItemsWith(keyArray: stringArray, menuItemSnapshot: snapshot.childSnapshot(forPath: "MenuItems"))
                    case "Dessert":
                        self.desserts.keys = stringArray
                        self.desserts.items = self.getItemsWith(keyArray: stringArray, menuItemSnapshot: snapshot.childSnapshot(forPath: "MenuItems"))
                    case "Entree":
                        self.entrees.keys = stringArray
                        self.entrees.items = self.getItemsWith(keyArray: stringArray, menuItemSnapshot: snapshot.childSnapshot(forPath: "MenuItems"))
                    case "Sides":
                        self.sides.keys = stringArray
                        self.sides.items = self.getItemsWith(keyArray: stringArray, menuItemSnapshot: snapshot.childSnapshot(forPath: "MenuItems"))
                    default:
                        print("Food type doesn't exist")
                    }
                }
            }
            
            self.foodArray.append(self.appetizers)
            self.foodArray.append(self.entrees)
            self.foodArray.append(self.sides)
            self.foodArray.append(self.desserts)
            
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
        })
    }
    
    func getItemsWith(keyArray: [String], menuItemSnapshot: FIRDataSnapshot) -> [MenuItem] {
     
        var items = [MenuItem]()
        
        for key in keyArray{
            
            if key != ""  {
                
                if let dict = menuItemSnapshot.childSnapshot(forPath: key).value as! [String : AnyObject]? {
                    let item = MenuItem()
                
                        item.setValuesForKeys(dict)
                        items.append(item)
                }
            }
        }
        
        return items
    }
    
    func handleCancel() {
        dismiss(animated: true, completion: nil)
    }
    
    func arrayWith(value: String, array: [String]) -> [String]{
        var tempArray = array
        
        if array[0] == "" {
            tempArray[0] = value
        }else {
            tempArray.append(value)
        }
        
        return tempArray
    }
    
    func toMilliseconds(str: String) -> String{
        var temp = str
        
        temp = temp.replacingOccurrences(of: ".", with: "")
        temp = temp.substring(to: temp.index(temp.startIndex, offsetBy: 12))
        
        return temp
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        ref.child("Tables").child((selectedTable?.key)!).child("Orders").observeSingleEvent(of: .value, with: {(snapshot) in
        
            if var orderKeys = snapshot.value as! [String]? {
                
                var orderKey = String(NSDate.init().timeIntervalSince1970)
                
                orderKey = self.toMilliseconds(str: orderKey)
                
                print(orderKey)
                
                orderKeys = self.arrayWith(value: orderKey, array: orderKeys)
                
                let refreshAlert = UIAlertController(title: "Confirm Order", message: "Do you want to place an order for " + self.foodArray[indexPath.section].items[indexPath.row].name! + "?", preferredStyle: UIAlertControllerStyle.alert)
                
                refreshAlert.addAction(UIAlertAction(title: "Yes", style: .default, handler: { (action: UIAlertAction!) in

                    self.ref.child("Orders").child("OrderList").child(orderKey).setValue(["item":self.foodArray[indexPath.section].items[indexPath.row].name, "tableKey":(self.selectedTable?.key)!, "newStatus":"true"])
                    
                    self.ref.child("Orders").child("Placed").setValue(orderKeys)
                    
                    self.ref.child("Tables").child((self.selectedTable?.key)!).child("Orders").setValue(orderKeys)
                }))
                
                refreshAlert.addAction(UIAlertAction(title: "No", style: .cancel, handler: { (action: UIAlertAction!) in
                    print("Handle Cancel Logic here")
                    
                }))
                
                self.present(refreshAlert, animated: true, completion: nil)
                
                tableView.cellForRow(at: indexPath)?.isSelected = false
                
            }
            
        })
        
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> CustomTableCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! CustomTableCell
        
        cell.textLabel?.text = foodArray[indexPath.section].items[indexPath.row].name
        cell.setColors()
        return cell
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return foodArray.count
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return foodArray[section].type
    }
    
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        view.tintColor = CustomColor.Yellow500
        (view as! UITableViewHeaderFooterView).textLabel?.textColor = UIColor.black
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return foodArray[section].items.count
    }

}
