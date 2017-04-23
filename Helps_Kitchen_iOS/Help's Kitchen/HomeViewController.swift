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
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)

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
            ref.child("Users").observeSingleEvent(of: .value, with: { (snapshot) in
                for userType in snapshot.children {
                    let currentUserType = userType as! FIRDataSnapshot
                    
                    for user in currentUserType.children {
                        let currentUser = user as! FIRDataSnapshot
                        
                        if currentUser.key == uid {
                            switch currentUserType.key{
                                case "Host":
                                    let hostController = HostSeatingController()
                                    
                                    let navController = CustomNavigationController(rootViewController: hostController)
                                    
                                    self.present(navController, animated: true, completion: nil)
                                case "Server":
                                    let serverController = ServerTabBarController()
                                
                                    self.present(serverController, animated: true, completion: nil)
                                case "Kitchen":
                                    let kitchenController = KitchenOrderListController()
                                    
                                    let navController = CustomNavigationController(rootViewController: kitchenController)
                                    
                                    self.present(navController, animated: true, completion: nil)
                                    //TODO Add Kitchen ViewController
                            default:
                                self.handleLogout()
                            }
                        }
                    }
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
