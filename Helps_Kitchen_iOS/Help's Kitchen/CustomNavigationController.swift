//
//  CustomNavigationController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/15/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit

class CustomNavigationController: UINavigationController {

    override func viewDidLoad() {
        super.viewDidLoad()
        navigationBar.barTintColor = CustomColor.Grey900
        navigationBar.tintColor = CustomColor.UCFGold
        navigationBar.isTranslucent = false
        
        let titleDict = [NSForegroundColorAttributeName: CustomColor.UCFGold]
        navigationBar.titleTextAttributes = titleDict
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

}
