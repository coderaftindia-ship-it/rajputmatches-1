import React from 'react';

const EditPackage = () => 
    {
        return ( 
<>
<div className="main-content">
        <section className="section">
          <div className="section-body">

            <div className="row">

              <div class="col-12 col-md-6 col-lg-6">
                <div class="card">
                  <div class="card-header">
                    <h4>Edit Packages </h4>
                  </div>
                  <div class="card-body">
                    <div class="form-group">
                      <label>Name</label>
                      <input type="text" class="form-control"/>
                    </div>

                    <div class="form-group">
                      <label>Price</label>
                      <input type="text" class="form-control"/>
                    </div>

                    <div class="form-group">
                      <label>Packages Image</label>
                      <input type="file" class="form-control"/>
                    </div>
                  
                  </div>
                  <div class="card-footer text-right">
                    <button class="btn btn-primary mr-1" type="submit">Submit</button>
                  </div>
                </div>
              
                </div>
            </div>
          </div>
        </section>
        </div>
        
</>
)};

export default EditPackage;
