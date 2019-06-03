package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.DevBridgeApartment;
import vu.lt.entities.Office;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.DevbridgeApartmentsDAO;
import vu.lt.persistence.OfficesDAO;
import vu.lt.rest.contracts.DevbridgeApartmentDTO;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@LoggedInvocation
@RequestScoped
@Path("/offices/{officeId}/apartments")
public class DevbridgeApartmentController {

    @Inject
    @Getter @Setter
    OfficesDAO officesDAO;

    @Inject
    @Getter @Setter
    DevbridgeApartmentsDAO apartmentsDAO;

    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllApartmentsForOffice(@PathParam("officeId") final Integer officeId) {
        Office office = officesDAO.findById(officeId);
        if (office == null) return Response.status(Response.Status.NOT_FOUND).build();

        List<DevbridgeApartmentDTO> apartments = apartmentsDAO.getApartmentsForOffice(officeId);
        return Response.ok(apartments).build();
    }

    @Path("/{id}")
    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTrip(@PathParam("id") final Integer id) {
        DevBridgeApartment apartment = apartmentsDAO.findById(id);
        if(apartment == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(DevbridgeApartmentDTO.apartmentToApartmentDTO(apartment)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response create(@PathParam("officeId") final Integer officeId,
                           DevbridgeApartmentDTO apartmentDTO) {
        Office office = officesDAO.findById(officeId);
        if (office == null) return Response.status(Response.Status.NOT_FOUND).build();
        String address = apartmentDTO.getAddress();
        String name = apartmentDTO.getName();
        if (address == null || name == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        DevBridgeApartment apartment = new DevBridgeApartment();
        apartment.setAddress(address);
        apartment.setName(name);
        apartment.setOffice(office);
        apartmentsDAO.persist(apartment);
        return Response.ok().build();
    }

    @Path("/{id}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response update(@PathParam("officeId") final Integer officeId,
                           @PathParam("id") final Integer apartmentId,
                           DevbridgeApartmentDTO apartmentDTO) {
        Office office = officesDAO.findById(officeId);
        if (office == null) return Response.status(Response.Status.NOT_FOUND).build();
        DevBridgeApartment apartment = apartmentsDAO.findById(apartmentId);
        if (apartment == null) return Response.status(Response.Status.NOT_FOUND).build();
        String address = apartmentDTO.getAddress();
        if (address != null) apartment.setAddress(address);
        String name = apartmentDTO.getName();
        if (name != null) apartment.setName(name);
        apartmentsDAO.update(apartment);
        return Response.ok().build();
    }

    @Path("/{id}")
    @DELETE
    @AuthenticatedMethod
    @Transactional
    public Response delete(@PathParam("officeId") final Integer officeId,
                           @PathParam("id") final Integer apartmentId) {
        DevBridgeApartment apartment = apartmentsDAO.findById(apartmentId);
        if (apartment == null) return Response.status(Response.Status.NOT_FOUND).build();
        apartmentsDAO.delete(apartment);
        return Response.ok().build();
    }
}
