//
//  StatusViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/13/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class SeatedViewController: CustomTableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: "https://helps-kitchen.firebaseio.com/")

    override func viewDidLoad() {
        super.viewDidLoad()
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "+", style: .plain, target: self, action: #selector(handleAddItems))
        navigationItem.leftBarButtonItem?.tintColor = CustomColor.amber500
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Pay", style: .plain, target: self, action: #selector(handlePay))

        // Do any additional setup after loading the view.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        
        
        let uid = FIRAuth.auth()?.currentUser?.uid
        
        if uid == nil {
            return
        }else{
            ref.child("users").child(uid!).observeSingleEvent(of: .value, with: { (snapshot) in
                let values = snapshot.value as? [String : AnyObject]
                
                let userHasPaid = values?["customerHasPaid"] as! Bool
                
                if userHasPaid {
                    self.dismiss(animated: true, completion: nil)
                }
                
            })
        }
        
    }
    
    func handleAddItems() {
        let addItemsController = AddItemsViewController()
        
        let navController = CustomNavigationController(rootViewController: addItemsController)
        
        self.present(navController, animated: true, completion: nil)
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell()
        cell.backgroundColor = UIColor.black
        return cell
    }
    
    
    func handlePay() {
        
        let paymentController = PaymentViewController()
        
        let navController = CustomNavigationController(rootViewController: paymentController)
        
        self.present(navController, animated: true, completion: {
            guard let uid = FIRAuth.auth()?.currentUser?.uid else{
                return
            }
        
            self.ref.child("users").child(uid).observeSingleEvent(of: .value, with: { (snapshot) in
                let values = snapshot.value as? [String : AnyObject]
            
                let customerHasPaid = values?["customerHasPaid"] as! Bool
            
                if customerHasPaid {
                    self.dismiss(animated: true, completion: nil)
                
                }
            })
        })
    }


}
