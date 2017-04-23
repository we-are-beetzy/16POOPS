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
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    var selectedTable: Table?
    
    var reservationIds = [String]()
    var reservations = [Reservation]()

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
        
        try ref.child("ReservationQueue").observe(.value, with: { (snapshot) in
            self.reservations = [Reservation]()
            
            print(snapshot)
            self.reservationIds = ((snapshot.value) as! [String])
            
            for eachId in self.reservationIds {
                
                if eachId != ""{
                    
                    self.ref.child("Reservations").child(eachId).observeSingleEvent(of: .value, with: { (snapshot) in
                        if let dict = snapshot.value as? [String: AnyObject] {
                            
                            let tempReservation = Reservation()
                            
                            tempReservation.name = dict["name"] as? String
                            tempReservation.partySize = dict["partySize"] as! Int?
                            
                            self.reservations.append(tempReservation)
                            
                            DispatchQueue.main.async {
                                self.tableView.reloadData()
                            }
                        }
                    })
                }
            }
        })
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    //TODO: Add overrides for num section, etc.
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return reservations.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> CustomTableCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! CustomTableCell
        
        cell.textLabel?.text = reservations[indexPath.row].name
        cell.setColors()
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedRes = reservations[indexPath.row]
        
        if selectedRes.partySize! <= (selectedTable?.capacity)!{
            
            //add to table
        ref.child("Tables").child((selectedTable?.key)!).child("reservationName").setValue(reservations[indexPath.row].name)
            
            //change table status
            ref.child("Tables").child((selectedTable?.key)!).child("status").setValue("seated")
            ref.child("Tables").child((selectedTable?.key)!).child("newStatus").setValue("false")
            
            //remove from seatingQueue
            removeUserFromQueue(index: indexPath.row)
        }else{
            let refreshAlert = UIAlertController(title: "Party Too Big!", message: "Do you want to seat them here anyway?", preferredStyle: UIAlertControllerStyle.alert)
            
            refreshAlert.addAction(UIAlertAction(title: "Yes", style: .default, handler: { (action: UIAlertAction!) in
                
                //add to table
                self.ref.child("Tables").child((self.selectedTable?.key)!).child("reservationName").setValue(self.reservations[indexPath.row].name)
                
                //change table status
                self.ref.child("Tables").child((self.selectedTable?.key)!).child("status").setValue("seated")
                self.ref.child("Tables").child((self.selectedTable?.key)!).child("newStatus").setValue("false")
                
                //remove from seatingQueue
                self.removeUserFromQueue(index: indexPath.row)
            }))
            
            refreshAlert.addAction(UIAlertAction(title: "No", style: .cancel, handler: { (action: UIAlertAction!) in
                print("Handle Cancel Logic here")
                
            }))
            
            self.present(refreshAlert, animated: true, completion: nil)
            
            tableView.cellForRow(at: indexPath)?.isSelected = false
        }
    }
    
    func removeUserFromQueue(index: Int){
        
        var tempQueue = [String]()
        
        for res in reservations {
            tempQueue.append(res.name!)
        }
        
        if tempQueue.count == 1 {
            tempQueue[index] = ""
        }else {
            tempQueue.remove(at: index)
        }
        
        ref.child("ReservationQueue").setValue(tempQueue)
        
        dismiss(animated: true, completion: nil)
    }
    
}
