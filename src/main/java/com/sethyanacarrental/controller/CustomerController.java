package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.Customer;
import com.sethyanacarrental.model.User;
import com.sethyanacarrental.repository.CustomerRepository;
import com.sethyanacarrental.repository.CustomerStatusRepository;
import com.sethyanacarrental.repository.ReportRepository;
import com.sethyanacarrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController //make controller class readable to servlet
@RequestMapping(value = "/customer")
public class CustomerController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private CustomerRepository dao;

    @Autowired //create customerStatus interface instance(object)
    private CustomerStatusRepository daoStatus;

    //Get Mapping: for individual list
    @GetMapping(value = "/list_individual", produces = "application/json")
    public List<Customer> customersListIndividual() {
        return dao.listIndividual();
    }

    //Get Mapping: for company_list
    @GetMapping(value = "/list_company", produces = "application/json")
    public List<Customer> customersListCompany() {
        return dao.listCompany();
    }

    //Get Mapping: for next reg no
    @GetMapping(value = "/customer_reg_no", produces = "application/json")
    public Customer nextRegNo() {
        return (new Customer(dao.getCustomerRegNo()));
    }

    //Get Mapping: for Customer List
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
    }

    //Get Mapping: for Customer List with Searched Text
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName()); // get logged username and find in db
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMER"); //Retrieve which privileges the user has for module // return a hashmap(true, or false for each property{add,update,del}),   // and assign to hashmap variable

        if (user != null && priv != null && priv.get("select")) {

            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id")); // should explicitly create a method in Repository to pass searchtext value
        } else {
            return null;
        }
    }


    @PostMapping
    public String insert(@RequestBody Customer customer) { //In front end Post method send the Customer object in a request body and Back end should request it

        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get security context authentication object
        User user = userService.findUserByUserName(auth.getName()); //Get user form DB
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMER"); //Retrieve which privileges user has for modules

        if (user != null && priv != null && priv.get("add")) { //check user & privilege null and get privilege for add

            if (customer.getNic() != null) {
                Customer existCustomerNic = dao.checkNIC(customer.getNic());
                System.out.println(existCustomerNic);
                if (existCustomerNic != null) {
                    return "Entered NIC already exist!";
                }
            }
            try {
                dao.save(customer); //before this check for privileges and duplicates [like customer id, customer name] (will implement later)
                return "0"; //if save, return 0
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Saving: You have no Privilege!";
        }
    }

    //Put Mapping: for Update
    @PutMapping
    public String update(@RequestBody Customer customer) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMER");

        if (user != null && priv != null && priv.get("update")) {
            try {
                dao.save(customer);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Updating: You have no privilege!";
        }


    }

    //Delete Mapping
    @DeleteMapping
    public String delete(@RequestBody Customer customer) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMER");

        if (user != null && priv != null && priv.get("delete")) {
            try {
                customer.setCustomer_status_id(daoStatus.getById(3)); //change customer status before deleting(red row) //getById(3): get object of id 3 which is 'Deleted'
                dao.save(customer);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete...." + ex.getMessage();
            }
        } else {
            return "Error in Deleting: You have no privilege!";
        }
    }
}
