using API_RedMango.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API_RedMango.Controllers
{
    [Route("api/MenuItem")]
    [ApiController]
    public class MenuItemController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileUpload _fileUpload;
        private ApiResponse _response;
        public MenuItemController(ApplicationDbContext db,IFileUpload fileUpload)
        {
            _db = db;
            _fileUpload = fileUpload;
            _response = new ApiResponse();
        }

        [HttpGet]
        public async Task<IActionResult> GetMenuItems()
        {
            _response.Result = _db.MenuItems;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }

        [HttpGet("{id:int}", Name = "GetMenuItem")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }

            MenuItem menuItem = _db.MenuItems.FirstOrDefault(u => u.Id == id);

            if (menuItem == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                return NotFound(_response);
            }

            _response.Result = menuItem;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse>> CreateMenuItem([FromForm] MenuItemCreateDTO menuItemCreateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (menuItemCreateDTO.File == null || menuItemCreateDTO.File.Length == 0)
                    {
                        return BadRequest();
                    }

                    string fileName = await _fileUpload.UploadFile(menuItemCreateDTO.File);

                    MenuItem menuItemToCreate = new()
                    {
                        Name = menuItemCreateDTO.Name,
                        Price = menuItemCreateDTO.Price,
                        Category = menuItemCreateDTO.Category,
                        SpecialTag = menuItemCreateDTO.SpecialTag,
                        Description = menuItemCreateDTO.Description,
                        Image = fileName,
                    };

                    _db.MenuItems.Add(menuItemToCreate);
                    await _db.SaveChangesAsync();

                    _response.Result = menuItemToCreate;
                    _response.StatusCode = HttpStatusCode.Created;

                    return CreatedAtRoute("GetMenuItem", new { id = menuItemToCreate.Id }, _response);

                }
                else
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }

            return _response;
        }

    }

}
