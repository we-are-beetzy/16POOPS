//
//  HomeViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/13/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class HomeViewController: UIViewController {
    let ref = FIRDatabase.database().reference(fromURL: "https://helps-kitchen.firebaseio.com/")

    override func viewDidLoad() {
        super.viewDidLoad()
    
        checkStatus()
    }
        
    override func viewDidAppear(_ animated: Bool){
            
        checkStatus()
        
    }
    
    func checkStatus() {
        
        let uid = FIRAuth.auth()?.currentUser?.uid
        
        if uid == nil {
            handleLogout()
        }else{
            ref.child("users").child(uid!).observeSingleEvent(of: .value, with: { (snapshot) in
                let values = snapshot.value as? [String : AnyObject]
                
                let userType = values?["userType"] as! String
                
                if userType == "customer" {
                    
                    let customerHasReservation = values?["customerHasReservation"] as! Bool
                    let customerIsSeated = values?["customerIsSeated"] as! Bool
                    
                    if customerHasReservation {
                        
                        if customerIsSeated {
                            
                            let tableStatusController = SeatedViewController()
                            
                            let navController = CustomNavigationController(rootViewController: tableStatusController)
                            self.present(navController, animated: true, completion: nil)
                            
                        }else{
                            
                            let waitingController = WaitingViewController()
                        
                            let navController = CustomNavigationController(rootViewController: waitingController)
                        
                            self.present(navController, animated: true, completion: nil)
                        }
                        
                    }else{
                        let reservationController = ReservationViewController()
                        
                        let navController = CustomNavigationController(rootViewController: reservationController)
                        
                        self.present(navController, animated: true, completion: nil)
                    }
                }else if userType == "host" {
                    
                    let hostController = HostSeatingController()
                    
                    let navController = CustomNavigationController(rootViewController: hostController)
                    
                    self.present(navController, animated: true, completion: nil)
                }else if userType == "server" {
                    let serverController = ServerTableController()
                    
                    let navController = CustomNavigationController(rootViewController: serverController)
                    
                    self.present(navController, animated: true, completion: nil)
                }
            })
        }
    }
    
    func handleLogout() {
        
        do{
            try FIRAuth.auth()?.signOut()
        }catch let logoutError {
            print(logoutError)
        }
        
        let loginViewController = LoginViewController()
        
        present(loginViewController, animated: true, completion: nil)
    }


}
