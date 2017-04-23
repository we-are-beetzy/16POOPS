//
//  ServerTabBarController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 4/1/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase


class ServerTabBarController: UITabBarController, UITabBarControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.delegate = self
        
        let tableController = ServerTableController()
        
        let tabOne = CustomNavigationController(rootViewController: tableController)
        
        let tabOneBarItem = UITabBarItem(title: "Tables", image: nil, selectedImage: nil)
        
        tabOne.tabBarItem = tabOneBarItem
        
        let orderController = ServerOrderViewController()
        
        let tabTwo = CustomNavigationController(rootViewController: orderController)
        
        let tabTwoBarItem = UITabBarItem(title: "Orders", image: nil, selectedImage: nil)
        
        tabTwo.tabBarItem = tabTwoBarItem
        
        self.viewControllers = [tabOne, tabTwo]
        

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
