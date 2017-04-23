//
//  NewOrderViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 4/1/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit

class NewOrderViewController: UITabBarController, UITabBarControllerDelegate {
    
    var selectedTable: Table?

    override func viewDidLoad() {
        super.viewDidLoad()

        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        self.delegate = self
        
        let newFoodController = NewFoodViewController()
        newFoodController.selectedTable = self.selectedTable
        
        let tabOne = CustomNavigationController(rootViewController: newFoodController)
        
        let tabOneBarItem = UITabBarItem(title: "Food", image: nil, selectedImage: nil)
        
        tabOne.tabBarItem = tabOneBarItem
        
        let newDrinkController = NewDrinkViewController()
        newDrinkController.selectedTable = self.selectedTable
        
        let tabTwo = CustomNavigationController(rootViewController: newDrinkController)
        
        let tabTwoBarItem = UITabBarItem(title: "Drink", image: nil, selectedImage: nil)
        
        tabTwo.tabBarItem = tabTwoBarItem
        
        self.viewControllers = [tabOne, tabTwo]
    }
    
}
