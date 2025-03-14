const ServiceService = require("../services/serviceService");
const ResponseJson = require("../utils/ResponseJson");

class ServiceController {
  static async createService(req, res) {
    try {
      const service = await ServiceService.createService(req.body);
      return res.status(201).json(ResponseJson.success({ service }, 201));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getAllServices(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
      };

      const result = await ServiceService.getAllServices(options);
      return res.status(200).json(ResponseJson.success(result));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getServiceById(req, res) {
    try {
      const service = await ServiceService.getServiceById(req.params.id);
      return res.status(200).json(ResponseJson.success({ service }));
    } catch (error) {
      if (error.message === "Service non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async updateService(req, res) {
    try {
      const service = await ServiceService.updateService(
        req.params.id,
        req.body
      );
      return res.status(200).json(ResponseJson.success({ service }));
    } catch (error) {
      if (error.message === "Service non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async deleteService(req, res) {
    try {
      await ServiceService.deleteService(req.params.id);
      return res
        .status(200)
        .json(
          ResponseJson.success({ message: "Service supprimé avec succès" })
        );
    } catch (error) {
      if (error.message === "Service non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getAllServicesWithoutPagination(req, res) {
    try {
      const services = await ServiceService.getAllServicesWithoutPagination();
      return res.status(200).json(ResponseJson.success({ services }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = ServiceController;
