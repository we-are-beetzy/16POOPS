//
//  KitchenViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 4/5/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit

class KitchenViewController: UIViewController {
    
    let containerView: UIView = {
        let cv = UIView()
        
        return cv
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let controller = KitchenOrderListController()
        
        
        view.addSubview(containerView)
        containerView.addSubview(controller.view)
        
        setupContainerView()
        
        NSLayoutConstraint.activate([
            controller.view.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            controller.view.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            controller.view.topAnchor.constraint(equalTo: containerView.topAnchor),
            controller.view.bottomAnchor.constraint(equalTo: containerView.bottomAnchor)
            ])
        
        controller.didMove(toParentViewController: self)

        // Do any additional setup after loading the view.
    }

    func setupContainerView() {
        containerView.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 100).isActive = true
        containerView.topAnchor.constraint(equalTo: view.topAnchor, constant: 300).isActive = true
        containerView.widthAnchor.constraint(equalTo: view.widthAnchor, constant: -20).isActive = true
        containerView.heightAnchor.constraint(equalTo: view.heightAnchor, constant: -160).isActive = true
    }
}
